import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { ECharts, init } from 'echarts';
import { AlarmClockIcon, PauseIcon, PlayIcon, ResetIcon } from './icon/svg';
import { Button, MessagePlugin } from 'tdesign-react';
import { listen } from '@tauri-apps/api/event';
import { invoke, Channel } from '@tauri-apps/api/core';
import { configAtom } from './store';
import { useAtom } from 'jotai';
import { getMsgOpt, isDev, sleep } from './util';
import { tr } from 'framer-motion/client';

const option = {
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
  power: [] as number[][],
  torque: [] as number[][]
}
function PowerChart() {
  const chartRef = useRef(null);
  const zeroData: [number, number][] = []
  const [config, setConfig] = useAtom(configAtom)
  let chartInstance = useRef<ECharts | null >(null);
  const [isCatching, setIsCatching] = useState(false);
  const isCatchingRef = useRef(isCatching);

  const startUdp = useCallback((forceStart?: boolean) => {
    console.log("🪵 [chart.tsx:18] startUdp ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);
    if (isCatching && !forceStart) {
      setIsCatching(false);
      stopMsg()
    } else if (!isCatching || forceStart) {
      setIsCatching(true);
      initUdp()
    }
  }, [isCatching, config]);


  const testStartUdp = useCallback(() => {
    const testEvent = () => {
      const onEvent = new Channel<UdpEvent2>();
      onEvent.onmessage = (message) => {
        let dat = message.data;
        try {
          buildData(dat.data)
        } catch (error) {
          console.log("🪵 [chart.tsx:157] ~ token ~ \x1b[0;32merror\x1b[0m = ", error);
        }
        console.log("🪵 [chart.tsx:155] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
        // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
        // console.log(`got download event ${message.event}`);
      };
      return onEvent
    }
    if (isCatching) {
      setIsCatching(false);
      isCatchingRef.current = false
      stopMsg()
    } else if (!isCatching) {
      setIsCatching(true);
      isCatchingRef.current = true
      // initUdp()
      // console.log("🪵 [chart.tsx:168] ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);

      invoke('local_data_test_mode', { config,  },);
      sleep(50).then(() => {
        invoke('loop_send_data', { config,reader: testEvent() },);
      })
    }

  }, [isCatching, config]);

  const saveLoaclUdpData = () => {
    invoke('set_saving_data_flag', { config },);

  }

  // const loopUpdateChart = useCallback((start?:boolean) => {
  //   console.log("🪵 [chart.tsx:18] startUdp ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);
  //   if (isCatchingRef.current) {
  //     let newOption = JSON.parse(JSON.stringify(option));
  //     newOption.series[0].data = chartData.power;
  //     newOption.series[1].data = chartData.torque;
  //       console.log("🪵 [chart.tsx:187] ~ token ~ \x1b[0;32mchartInstance.current\x1b[0m = ", chartInstance.current);
  //     if (chartInstance.current) {
  //       chartInstance.current.setOption(newOption);
  //       console.log("🪵 [chart.tsx:188] ~ token ~ \x1b[0;32mnewOption\x1b[0m = ", newOption);
  //     }
  //     sleep(500).then(() => loopUpdateChart());

  //   }
  // }, [isCatching]);

  const buildData = (data: UdpDataItem2) => {
    // console.log("🪵 [chart.tsx:196] ~ token ~ \x1b[0;32mdata\x1b[0m = ", data);
    // let powerList = chartData.power;
    // let torqueList = chartData.torque;
    let plist = data.power
    let tlist = data.torque
    // chartData.power = plist;
    // chartData.torque = tlist
    let newOption = JSON.parse(JSON.stringify(option));
    newOption.series[0].data = plist;
    newOption.series[1].data = tlist;
    if (chartInstance.current) {
      chartInstance.current.setOption(newOption);
    }
  };


  const initUdp = useCallback(() => {
    const onEvent = new Channel<UdpEvent2>();
    onEvent.onmessage = (message) => {
      let dat = message.data;
      buildData(dat.data)
      // console.log("🪵 [chart.tsx:149] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
      // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
      // console.log(`got download event ${message.event}`);
    };
    invoke('init_config', { config, reader: onEvent },);
  }, [isCatching, config])


  const stopMsg = () => {
    invoke('stop_udp', { config },);
  };

  const addListen = async () => {
    const faillistenPromise = listen('connect_fail', (event) => {
      console.log('err:', event.payload);
      MessagePlugin.error({ content: `error: ${event.payload}`, ...getMsgOpt(0), closeBtn: true });
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
    if (!isCatching) return
    startUdp()
    sleep(1000).then(() => {
      console.log(`fucking sleep`,);
      startUdp(true)
    })
  }, [isCatching, config]);

  const reset = () => {
    chartData.power = zeroData;
    chartData.torque = zeroData;
    let newOption = JSON.parse(JSON.stringify(option));
    newOption.series[0].data = zeroData;
    newOption.series[1].data = zeroData;
    
      console.log("🪵 [chart.tsx:281] ~ token ~ \x1b[0;32mchartInstance\x1b[0m = ", chartInstance.current);
      if (chartInstance.current) {
      chartInstance.current.setOption(newOption);
    }
  }


  useEffect(() => {
    // 在组件挂载后初始化 ECharts 实例
    chartInstance.current = init(chartRef.current);
    chartInstance.current.setOption(option);

    // 在组件卸载时销毁 ECharts 实例，防止内存泄漏
    let removeListen = () => { }
    addListen().then(r => removeListen = r);
    // sleep(5000).then(() => {
    //   initUdp();
    // })
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      removeListen();
    };
  }, []); // 空依赖数组确保 effect 只在挂载和卸载时执行一次

  useEffect(() => {
    
  },[isCatching])

  useEffect(() => {
    restartUdp()
  }, [config]);

  return <div className='w-full h-full'>
    <div ref={chartRef} className='w-full h-[580px]' style={{}}></div>
    <div className='flex items-center justify-center pt-8'>

      <Button theme={isCatching ? "warning" : 'success'} variant="base" title='开始记录' className='' size='large' onClick={() => { startUdp() }} >
        {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}
      </Button>
      <span className='mr-8'></span>
      <Button theme="danger" size='large' title='重置图表' variant="base" onClick={reset}>
        <ResetIcon size={36} />
      </Button>
      <span className='mr-8'></span>
      {
        isDev() && [
          <Button theme={'primary'}
            // disabled={!isCatching}
            variant="base" title='save file' className='' size='large' onClick={() => { saveLoaclUdpData() }} >
            {/* {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}test */}
            <AlarmClockIcon size={36} />
          </Button>,
          <span className='mr-8'></span>,
          <Button theme={isCatching ? "warning" : 'success'} variant="base" title='test开始记录' className='' size='large' onClick={() => { testStartUdp() }} >
            {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}
            <span>test local</span>
          </Button>,
          <span className='mr-8'></span>,

        ]
      }


      {/* <Button color="primary">Button</Button> */}

    </div>
  </div>;
}

export default memo(PowerChart);
