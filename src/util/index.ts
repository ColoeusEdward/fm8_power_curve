export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMsgOpt = (dur = 3000) => {
  return {
    offset: [0, 0],
    className: 'msg-animation-active  rounded-md',
    duration: dur,
    style: {
      animationDuration: `${dur / 1000}s`
    }
  }
}

export const isDev = () => import.meta.env.MODE === 'development';


export const listenHideCode = (func: () => void) => {
  let pressedKeys = ''; // Stores the sequence of pressed keys
  const targetSequence = '78787788'; // The sequence you're looking for
  const sequenceMaxLength = targetSequence.length; // Max length to keep our `pressedKeys` manageable

  let handle = (event: KeyboardEvent) => {
    const pressedKey = event.key; // Get the key that was pressed

    // We only care about digit keys for this example
    if (!isNaN(parseInt(pressedKey))) {
      pressedKeys += pressedKey;

      // Keep the `pressedKeys` string at a manageable length
      // by only keeping the last `sequenceMaxLength` characters
      if (pressedKeys.length > sequenceMaxLength) {
        pressedKeys = pressedKeys.slice(-sequenceMaxLength);
      }

      // Check if the current sequence matches our target
      if (pressedKeys === targetSequence) {
        // myFunction();
        func();
        // Optionally, reset pressedKeys after a match
        // This prevents repeated triggers if the user keeps typing the sequence
        pressedKeys = '';
      }
    } else {
      // If a non-digit key is pressed, reset the sequence
      // This prevents partial matches from carrying over
      pressedKeys = '';
    }

  }

  document.addEventListener('keydown', handle);

  return () => {
    document.removeEventListener('keydown', handle);
    // console.log("🪵 [index.ts:54] ~ token ~ \x1b[0;32mkeydown\x1b[0m = ", 'keydown监听移除');
  }
}

export const  calculateFittedCurveData = (rawData: number[][]) => {
  // 实际项目中，这里会调用一个统计库进行拟合
  // 例如，使用 simple-statistics 的 polynomialRegression
  // const regression = ss.polynomialRegression(rawData.map(d => ({ x: d[0], y: d[1] })), 2); // 2次多项式
  // const line = ss.polynomialRegressionLine(regression);

  const fittedPoints = [];
  const minRPM = Math.min(...rawData.map(d => d[0]));
  const maxRPM = Math.max(...rawData.map(d => d[0]));

  // 在 RPM 范围内，以较小步长生成曲线点
  for (let rpm = minRPM; rpm <= maxRPM; rpm += 50) { // 每50RPM计算一个点
      // const predictedHP = line(rpm); // 实际的拟合函数调用
      const predictedHP = 0.000005 * rpm * rpm + 0.05 * rpm + 10; // 这是一个简单的示例二次函数
      fittedPoints.push([rpm, predictedHP]);
  }
  return fittedPoints;
}

export function roundToDecimalPlaces(num:number, digits = 2) {
  return parseFloat(num.toFixed(digits));
}