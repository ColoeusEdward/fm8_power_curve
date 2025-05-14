import { useRef, useEffect } from 'react';
import {ECharts,init} from 'echarts';

function PowerChart() {
  const chartRef = useRef(null);
  let chartInstance:ECharts|null = null;

  useEffect(() => {
    // 在组件挂载后初始化 ECharts 实例
    chartInstance = init(chartRef.current);
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['邮件营销', '联盟广告'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
    };
    chartInstance.setOption(option);

    // 在组件卸载时销毁 ECharts 实例，防止内存泄漏
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, []); // 空依赖数组确保 effect 只在挂载和卸载时执行一次

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
}

export default PowerChart;
