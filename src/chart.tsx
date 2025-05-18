import { useRef, useEffect, useState, useCallback } from 'react';
import { ECharts, init } from 'echarts';
import { PauseIcon, PlayIcon, ResetIcon } from './icon/svg';
import { Button, MessagePlugin } from 'tdesign-react';
import { listen } from '@tauri-apps/api/event';
import { invoke, Channel } from '@tauri-apps/api/core';
import { configAtom } from './store';
import { useAtom } from 'jotai';
import { getMsgOpt, sleep } from './util';

const option =  {
  "xAxis": {
    "type": "value",
    "name": "转速 (RPM)",
    "nameLocation": "middle",
    "nameGap": 30,
    "splitLine": {
      "show": false
    }
  },
  "yAxis": [
    {
      "type": "value",
      // "name": "马力 (HP)",
      "nameLocation": "middle",
      "nameGap": 30,
      "splitLine": {
        "show": false
      },
      "axisLine": {
        "lineStyle": {
          "color": "#f45057"
        }
      },
      "axisLabel": {
        "formatter": "{value} HP"
      }
    },
    {
      "type": "value",
      // "name": "扭矩 (Nm)",
      "nameLocation": "middle",
      "nameGap": 35,
      "splitLine": {
        "show": false
      },
      "axisLine": {
        "lineStyle": {
          "color": "#3b37c8"
        }
      },
      "axisLabel": {
        "formatter": "{value} Nm"
      }
    }
  ],
  "series": [
    {
      "name": "马力",
      "type": "line",
      "data": [
        [1000, 50],
        [2000, 100],
        [3000, 150],
        [4000, 200],
        [5000, 220],
        [6000, 210],
        [7000, 180]
      ],
      "yAxisIndex": 0,
      sampling: 'lttb',
      "itemStyle": {
        "color": "#f45057"
      },
      "lineStyle": {
        "color": "#f45057"
      },
      "tooltip": {
        "valueFormatter": function (value: number) {
          return value + ' HP';
        }
      }
    },
    {
      "name": "扭矩",
      "type": "line",
      "data": [
        [1000, 37],
        [2000, 74],
        [3000, 112],
        [4000, 149],
        [5000, 164],
        [6000, 157],
        [7000, 134]
      ],
      "yAxisIndex": 1,
      sampling: 'lttb',
      "itemStyle": {
        "color": "#3b37c8"
      },
      "lineStyle": {
        "color": "#3b37c8"
      },
      "tooltip": {
        "valueFormatter": function (value: number) {
          return value + ' Nm';
        }
      }
    }
  ],
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "cross"
    }
  },
  "legend": {
    "data": ["马力", "扭矩"]
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
}
const chartData = {
  power:[] as number[][],
  torque:[]as number[][]
}
function PowerChart() {
  const chartRef = useRef(null);
  const zeroData: [number, number][] = []
  const [config, setConfig] = useAtom(configAtom)
  let chartInstance: ECharts | null = null;
  const [isCatching, setIsCatching] = useState(false);

  const startUdp = useCallback((forceStart?: boolean) => {
      console.log("🪵 [chart.tsx:18] startUdp ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);
      if(isCatching && !forceStart) {
      setIsCatching(false);
      stopMsg()
    }else if(!isCatching || forceStart){
      setIsCatching(true);
      initUdp()
      loopUpdateChart(); 
    }
  }, [isCatching,config]);

  const loopUpdateChart = useCallback(() => {
    if ( isCatching){
      let newOption = JSON.parse(JSON.stringify(option));
      newOption.series[0].data = chartData.power;
      newOption.series[1].data = chartData.torque;
      if (chartInstance) {
        chartInstance.setOption(newOption);
      }
    sleep(500).then(() => loopUpdateChart());

    }
  }, [isCatching]);

  const buildData = (data:UdpDataItem[]) => {
    let powerList= chartData.power;
    let torqueList= chartData.torque;
    let rpm = Number(data[1].val);
    let power = Number(data[0].val);
    let torque = Number(data[3].val);
    for (let i = powerList.length - 1; i >= 0; i--) {
      if(powerList[i][0]<=rpm){
        //inset data in array
        powerList.splice(i, 0, [rpm,power]);
      }
      if(torqueList[i][0]<=rpm){
        torqueList.splice(i, 0,[rpm,torque]);
      }
    }

    // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mpowerList\x1b[0m = ", powerList);
    
  };
  

  const initUdp =  useCallback(() => {
    const onEvent = new Channel<UdpEvent>();
    onEvent.onmessage = (message) => {
      let dat = message.data;
      buildData(dat)
      // console.log("🪵 [chart.tsx:149] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
      // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
      // console.log(`got download event ${message.event}`);
    };
    invoke('init_config', { config ,reader:onEvent},);
  },[isCatching,config])
  

  const stopMsg = () => {
    invoke('stop_udp', { config },);
  };

  const addListen = async () => {
    const faillistenPromise = listen('connect_fail', (event) => {
      console.log('err:', event.payload);
      MessagePlugin.error({ content: `error: ${event.payload}`, ...getMsgOpt(0),closeBtn: true });
      setIsCatching(false);
      // if(isCatching) {
      //   sleep(2000).then(() => {
      //     initUdp()
      //   })
      // }
      // event.payload will be the JSON object sent from Rust:
      // { sender: "...", data: "..." } or { sender: "...", data: "...", rawData: [...] }
      // Update your UI with the received data
    });
    const connectStopPromise = listen('connect_stop', (event) => {
      console.log('info:', event.payload);
    })

    const unlisten = await Promise.all([faillistenPromise, connectStopPromise]);
    // initUdp();
    return () => {
      unlisten.forEach((unlisten) => unlisten());
    };
  }

  const restartUdp = useCallback(() => {
    console.log("🪵 [chart.tsx:65] ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);
    if(!isCatching) return
    startUdp()
    sleep(1000).then(() => {
      console.log(`fucking sleep`,);
      startUdp(true)
    })
  }, [isCatching,config]);

  const reset = () => {
    let newOption = JSON.parse(JSON.stringify(option));
    newOption.series[0].data = zeroData;
    newOption.series[1].data = zeroData;
    if (chartInstance) {
      chartInstance.setOption(newOption);
    }
  }


  useEffect(() => {
    // 在组件挂载后初始化 ECharts 实例
    chartInstance = init(chartRef.current);
    chartInstance.setOption(option);

    // 在组件卸载时销毁 ECharts 实例，防止内存泄漏
    let removeListen = () => { }
    addListen().then(r => removeListen = r);
    // sleep(5000).then(() => {
    //   initUdp();
    // })
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
      removeListen();
    };
  }, []); // 空依赖数组确保 effect 只在挂载和卸载时执行一次

  useEffect(() => {
    restartUdp()
  }, [config]);

  return <div className='w-full h-full'>
    <div ref={chartRef} className='w-full h-[580px]' style={{}}></div>
    <div className='flex items-center justify-center pt-8'>

      <Button theme={isCatching ? "warning" : 'success'} variant="base" title='开始记录' className='' size='large' onClick={() => {startUdp()}} >
        {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}
      </Button>
      <span className='mr-8'></span>
      <Button theme="danger" size='large' title='重置图表' variant="base" onClick={reset}>
        <ResetIcon size={36} />
      </Button>
      <span className='mr-8'></span>
      {/* <Button color="primary">Button</Button> */}

    </div>
  </div>;
}

export default PowerChart;
