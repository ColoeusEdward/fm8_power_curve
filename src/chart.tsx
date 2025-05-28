import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { ECharts, init, registerTransform } from 'echarts';
import { AlarmClockIcon, PauseIcon, PlayIcon, RecordIcon, ResetIcon } from './icon/svg';
import { Button, Dialog, InputNumber, MessagePlugin, Switch } from 'tdesign-react';
import { listen } from '@tauri-apps/api/event';
import { invoke, Channel } from '@tauri-apps/api/core';
import { calcMaxDisableAtom, configAtom, hideBtnShowAtom, maxDataAtom, maxRpmZoneAtom, realTimeDataAtom, windowSizeAtom } from './store';
import { useAtom } from 'jotai';
import { getMsgOpt, isDev, listenHideCode, sleep } from './util';
import { option2 } from './util/config';
import { regression } from 'echarts-stat';

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
let initCount = 0
let nowOption:any = {}
function PowerChart() {
  const chartRef = useRef(null);
  const zeroData: [number, number][] = []
  const [config, setConfig] = useAtom(configAtom)
  let chartInstance = useRef<ECharts | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const isCatchingRef = useRef(isCatching);
  const [maxDataItem, setMaxDataItem] = useAtom(maxDataAtom)
  const [realTimeData, setRealTimeData] = useAtom(realTimeDataAtom)
  const [hideBtnShow, setHideBtnShow] = useAtom(hideBtnShowAtom)
  const [calcMaxDisable, setCalcMaxDisable] = useAtom(calcMaxDisableAtom)
  const [chartHeight, setChartHeight] = useState(580)
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom)
  const [isSaveing, setIsSaveing] = useState(false)
  const [currentActiveDataIndex, setCurrentActiveDataIndex] = useState<number>(-1);
  const [maxRpmZone, setMaxRpmZone] = useAtom(maxRpmZoneAtom)


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

  const realTimeEvent = () => {
    const onEvent = new Channel<RealTimeEvent>();
    onEvent.onmessage = (message) => {
      let dat = message.data;
      try {
        setRealTimeData(dat.data)
      } catch (error) {
        console.log("🪵 [chart.tsx:157] ~ token ~ \x1b[0;32merror\x1b[0m = ", error);
      }
      // console.log("🪵 [chart.tsx:155] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
      // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
      // console.log(`got download event ${message.event}`);
    };
    return onEvent
  }

  const powerEvent = () => {
    const onEvent = new Channel<UdpEvent2>();
    onEvent.onmessage = (message) => {
      let dat = message.data;
      try {
        console.log("🪵 [chart.tsx:182] ~ token ~ \x1b[0;32mdat.data.power.length\x1b[0m = ", dat.data.power.length);
        if(dat.data.power.length > 100 && calcMaxDisable) {
          setCalcMaxDisable(false)
        }
        buildData(dat.data)
        setMaxData(dat.data)
      } catch (error) {
        console.log("🪵 [chart.tsx:157] ~ token ~ \x1b[0;32merror\x1b[0m = ", error);
      }
      // console.log("🪵 [chart.tsx:155] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
      // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
      // console.log(`got download event ${message.event}`);
    };
    return onEvent
  }

  const testStartUdp = useCallback(() => {

    if (isCatching) {
      setIsCatching(false);
      isCatchingRef.current = false
      stopMsg()
    } else if (!isCatching) {
      setIsCatching(true);
      isCatchingRef.current = true
      // console.log("🪵 [chart.tsx:168] ~ token ~ \x1b[0;32misCatching\x1b[0m = ", isCatching);

      invoke('local_data_test_mode', { config, realTimeEvent: realTimeEvent() },);
      sleep(50).then(() => {
        invoke('loop_send_data', { config, reader: powerEvent() },);
      })
    }

  }, [isCatching, config]);

  const saveLoaclUdpData = (val: boolean) => {
    invoke('set_saving_data_flag', { config, isOpen: val },);
    setIsSaveing(val)
  }
  const setMaxData = (data: UdpDataItem2) => {
    if (data.power.length === 0 || data.torque.length === 0) return
    let item: maxDataItem = { power: { max: 0, rpm: 0 }, torque: { max: 0, rpm: 0 } }
    let plist = data.power
    let powerValLits = plist.map((item) => item[1])
    let pidx = powerValLits.indexOf(Math.max(...powerValLits))
    item.power.max = powerValLits[pidx]
    item.power.rpm = plist[pidx][0]

    let tlist = data.torque
    let torqueValLits = tlist.map((item) => item[1])
    let tidx = torqueValLits.indexOf(Math.max(...torqueValLits))
    item.torque.max = torqueValLits[tidx]
    item.torque.rpm = tlist[tidx][0]

    setMaxDataItem(item)
  }

  const buildData = (data: UdpDataItem2) => {
    // console.log("🪵 [chart.tsx:196] ~ token ~ \x1b[0;32mdata\x1b[0m = ", data);
    // let powerList = chartData.power;
    // let torqueList = chartData.torque;
    let plist = data.power
    let tlist = data.torque
    // chartData.power = plist;
    // chartData.torque = tlist
    let newOption = JSON.parse(JSON.stringify(option2));
    // var myRegression = regression("polynomial", plist, 4);
    // myRegression.points.sort(function (a, b) {
    //   return a[0] - b[0];
    // });
    newOption.dataset.source = plist.map((e, i) => [e[0], e[1], tlist[i][1]]);

    nowOption = newOption
    // newOption.series[0].data = plist;
    // newOption.series[1].data = tlist;
    if (chartInstance.current) {
      chartInstance.current.setOption(newOption);
    }
  };


  const initUdp = useCallback(() => {
    const onEvent = new Channel<UdpEvent2>();
    onEvent.onmessage = (message) => {
      let dat = message.data;
      buildData(dat.data)
      setMaxData(dat.data)
      if(dat.data.power.length > 300 && calcMaxDisable) {
        setCalcMaxDisable(false)
      }
      // console.log("🪵 [chart.tsx:149] ~ token ~ \x1b[0;32mdat\x1b[0m = ", dat);
      // console.log("🪵 [chart.tsx:37] ~ token ~ \x1b[0;32mmessage\x1b[0m = ", message);
      // console.log(`got download event ${message.event}`);
    };

    setCalcMaxDisable(true)
    invoke('init_config', { config, realTimeEvent: realTimeEvent() },);
    sleep(50).then(() => {
      invoke('loop_send_data', { config, reader: powerEvent() },);
    })
  }, [isCatching, config])


  const stopMsg = () => {
    invoke('stop_udp', { config },);
  };

  const addListen = () => {

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

    const unlisten = Promise.all([faillistenPromise, connectStopPromise]);
    console.log(`listen add`,);
    let removefn = listenHideCode(() => {
      console.log(`bingo`,);
      setHideBtnShow(e => !e)
    })

    return () => {
      unlisten.then((list) => {
        list.forEach((unlisten) => unlisten());
      })
      removefn()
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
    let newOption = JSON.parse(JSON.stringify(option2));
    newOption.series[0].data = zeroData;
    newOption.series[1].data = zeroData;
    setCalcMaxDisable(true)
    invoke('reset_data', { config },);


    // console.log("🪵 [chart.tsx:281] ~ token ~ \x1b[0;32mchartInstance\x1b[0m = ", chartInstance.current);
    if (chartInstance.current) {
      chartInstance.current.setOption(newOption);
    }
  }


  const chartClick = (params: any) => {
    console.log("🪵 [chart.tsx:330] ~ token ~ \x1b[0;32mparams\x1b[0m = ", params);
    if (!chartInstance.current) {
      return;
    }
    // 如果点击的是散点图上的点
    if (params.componentType === 'series' && params.seriesType === 'scatter') {
      const dataIndex = params.dataIndex;

      if (currentActiveDataIndex === dataIndex) {
        // 如果点击的是同一个点，则隐藏 tooltip
        chartInstance.current.dispatchAction({
          type: 'hideTip'
        });
        setCurrentActiveDataIndex(-1);
      } else {
        // 隐藏上一个固定显示的 tooltip (如果有)
        if (currentActiveDataIndex !== -1) {
          chartInstance.current.dispatchAction({
            type: 'hideTip'
          });
        }
        // 显示当前点击点的 tooltip
        chartInstance.current.dispatchAction({
          type: 'showTip',
          seriesIndex: params.seriesIndex,
          dataIndex: dataIndex
        });
        setCurrentActiveDataIndex(dataIndex);
      }
    } else {
      // 如果点击了图表其他区域，隐藏 tooltip
      chartInstance.current.dispatchAction({
        type: 'hideTip'
      });
      setCurrentActiveDataIndex(-1);
    }
  }

  useEffect(() => {

    // 在组件挂载后初始化 ECharts 实例
    chartInstance.current = init(chartRef.current);
    chartInstance.current.setOption(option2);
    setCalcMaxDisable(true)
    // chartInstance.current.on('click', chartClick);

    // 在组件卸载时销毁 ECharts 实例，防止内存泄漏
    let removeListen = addListen()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      removeListen()
    };
  }, []);

  useEffect(() => {
    if (maxRpmZone.length > 0 && chartInstance.current && nowOption.series) {
      nowOption.series[0].markArea.data = [
        	[
        		{
        			xAxis: maxRpmZone[0], // 区域的x轴起始点，可以是具体数值，也可以是 'min', 'max', 'average'
        			yAxis: 0
        	},
        	{
        			xAxis: maxRpmZone[1], // 区域的x轴结束点
        			yAxis: 'max'
        	}
        	]
        ]
        nowOption.series[0].markLine.data = [
          { xAxis: maxRpmZone[0] }, { xAxis: maxRpmZone[1] }
        ]  
      chartInstance.current?.setOption(nowOption)
    }
  }, [maxRpmZone])

  useEffect(() => {
    restartUdp()
  }, [config]);

  useEffect(() => {
    if (windowSize) {
      setChartHeight(windowSize?.innerHeight - 140)
      sleep(15).then(() => {
        chartInstance.current?.resize()
      })
    }
  }, [windowSize])

  return <div className='w-full h-full'>
    <div ref={chartRef} className='w-full ' style={{ height: chartHeight + 'px' }}></div>
    <div className='flex items-center justify-center pt-8'>


      <Button theme={isCatching ? "warning" : 'success'} variant="base" title='开始记录' className='' size='large' onClick={() => { startUdp() }} >
        {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}
      </Button>
      <span className='mr-8'></span>
      <Button theme="danger" size='large' title='重置图表' variant="base" onClick={reset}>
        <ResetIcon size={36} />
      </Button>
      <span className='mr-8'></span>
      <CalcBtn />
      <span className='mr-8'></span>
      {
        hideBtnShow && [

          <Button theme={isCatching ? "warning" : 'success'} variant="base" title='test开始记录' className='' size='large' onClick={() => { testStartUdp() }} >
            {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}
            <span className=' leading-8'>test local data</span>
          </Button>,
          <span className='mr-8'></span>,
          <span>自动保存源数据</span>,
          <Switch className='' size='large' onChange={(e: boolean) => { saveLoaclUdpData(e) }} customValue={[true, false]} value={isSaveing} >
            {/* {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36} />}test */}
            {/* <RecordIcon size={26} /> */}
          </Switch>,
          <span className='mr-8'></span>,
        ]
      }


      {/* <Button color="primary">Button</Button> */}

    </div>
  </div>;
}

export default memo(PowerChart);

const CalcBtn = memo(() => {

  const [calcMaxDisable, setCalcMaxDisable] = useAtom(calcMaxDisableAtom)
  const [visible, setVisible] = useState(false);
  const [calcMaxRange, setCalcMaxRange] = useState<number>()
  const [maxRpmZone, setMaxRpmZone] = useAtom(maxRpmZoneAtom)

  const calc_max_click = () => {
    setVisible(true)
    
  }
  const maxAreaEvent = () => {
    const onEvent = new Channel<MaxAreaEvent>();
    onEvent.onmessage = (message) => {
      let dat = message.data
      setMaxRpmZone(dat.data)
    };
    return onEvent
  }
  const confirmFn = () => {
    if(calcMaxRange == 0 || !calcMaxRange){
      MessagePlugin.warning({ content: '请输入转速区间大小', ...getMsgOpt() });
    }else{
      setVisible(false)
      invoke('calc_max_area_rpm_zone', { rpmLength: calcMaxRange,maxAreaEvent:maxAreaEvent() });
    }
  }


  return [
    <Button theme="primary" size='large' title='' variant="base" onClick={calc_max_click} disabled={calcMaxDisable} >
      {/* <ResetIcon size={36} /> */}
      计算最大面积区间
    </Button>,
    <Dialog
      mode="modeless"
      header="计算最大面积区间"
      draggable={true}
      visible={visible}
      onClose={() => { setVisible(false) }}
      onOpened={() => {
        // console.log('dialog is open');
      }}
      onConfirm={confirmFn}
      confirmBtn="计算"
      onCancel={() => { setVisible(false) }}
    >
      <span className=' mr-2'>转速区间大小</span>
      <InputNumber size='large' theme="normal"
      placeholder='请输入数字'
         value={calcMaxRange} onChange={(value) => { setCalcMaxRange(value as number) }} />
    </Dialog>
  ]
})