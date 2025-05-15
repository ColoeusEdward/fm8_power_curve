import { useRef, useEffect, useState } from 'react';
import { ECharts, init } from 'echarts';
import { PauseIcon, PlayIcon, ResetIcon } from './icon/svg';
import { Button } from 'tdesign-react';

function PowerChart() {
  const chartRef = useRef(null);
  let chartInstance: ECharts | null = null;
  const [isCatching, setIsCatching] = useState(false);

  useEffect(() => {
    // 在组件挂载后初始化 ECharts 实例
    chartInstance = init(chartRef.current);
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
          sampling: 'lttb' ,
          "itemStyle": {
            "color": "#f45057"
          },
          "lineStyle": {
            "color": "#f45057"
          },
          "tooltip": {
            "valueFormatter": function (value:number) {
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
          sampling: 'lttb' ,
          "itemStyle": {
            "color": "#3b37c8"
          },
          "lineStyle": {
            "color": "#3b37c8"
          },
          "tooltip": {
            "valueFormatter": function (value:number) {
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
    chartInstance.setOption(option);

    // 在组件卸载时销毁 ECharts 实例，防止内存泄漏
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, []); // 空依赖数组确保 effect 只在挂载和卸载时执行一次

  return <div className='w-full h-full'>
    <div ref={chartRef} className='w-full h-[580px]' style={{}}></div>
    <div className='flex items-center justify-center pt-8'>

      <Button theme={isCatching ?"warning":'success'} variant="base" title='开始记录' className='' size='large' onClick={() => setIsCatching(!isCatching)} >
        {isCatching ? <PauseIcon size={36} /> : <PlayIcon size={36}  />}
      </Button>
      <span className='mr-8'></span>
      <Button theme="danger" size='large' title='重置图表' variant="base">
        <ResetIcon size={36}  />
      </Button>
      <span className='mr-8'></span>
      {/* <Button color="primary">Button</Button> */}
      
    </div>
  </div>;
}

export default PowerChart;
