import { memo, useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { getCurrentWindow } from '@tauri-apps/api/window';


import PowerChart from "./chart";
import { Button, Divider, Input, MessagePlugin, Statistic } from "tdesign-react";
import { useAtom } from "jotai";
import { configAtom, maxDataAtom, realTimeDataAtom, windowSizeAtom } from "./store";
import { getMsgOpt, sleep } from "./util";
import { CloseIcon, ForzaLogoIcon, MaximizeIcon, MaximizeRestoreIcon, MinimizeIcon } from "./icon/svg";

function App() {
  // const [ip, setIp] = useState('127.0.0.1');
  const [config, setConfig] = useAtom(configAtom)
  const [tempConfig, setTempConfig] = useState<typeof config>({ ...config })
  const [initCount, setInitCount] = useState(0)
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom)
  const [isMaxWin, setIsMaxWin] = useState(false)


  const watachResize = () => {
    const handle = function() {
      // 当窗口大小改变时执行的代码
      // console.log('窗口大小已改变！');
      // // 你可以在这里获取新的窗口宽度和高度
      // const newWidth = window.innerWidth;
      // const newHeight = window.innerHeight;
      setWindowSize({...window})
      sizeChange()

      // console.log(`新的宽度: ${newWidth}px, 新的高度: ${newHeight}px`);
    
      // 举例：根据窗口大小调整元素样式或布局
      
    }
    window.addEventListener('resize', handle);
    return () => {
       window.removeEventListener('resize', handle);
    }
  }

  const sizeChange = () => {

  }


  const closeWin = () => {
    let win = getCurrentWindow()
    win.close()
  }
  const miniWin = () => {
    let win = getCurrentWindow()
    win.minimize()
  }
  const saveConfig = () => {
    MessagePlugin.success({ content: '保存成功', ...getMsgOpt() });
    setConfig(tempConfig)
  }
  const maxWin = () => {
    let win = getCurrentWindow()
    win.toggleMaximize()
    setIsMaxWin((e) => !e)
  }

  useEffect(() => {
    sleep(50).then(() => {
      setTempConfig({ ...config })
    })

  }, [config])

  useEffect(() => {
    let remove = watachResize()
    return () => {
      remove()
    }
  }, [])

  // useEffect(() => {
  //   console.log("🪵 [App.tsx:83] ~ token ~ \x1b[0;32mwindowSize\x1b[0m = ", windowSize?.innerHeight);

  // },[windowSize])

  return (
    <main className="w-full overflow-hidden" style={{ height:windowSize ? windowSize.innerHeight+'px' : '720px' }}>
      
      <div data-tauri-drag-region className=" h-8 w-full bg-gray-100 relative z-50 flex items-center">
        <span className={'ml-2'}><ForzaLogoIcon size={40} /></span>
        <span data-tauri-drag-region className="ml-2 text-stone-800 select-none">极限竞速马力曲线绘制工具</span>
        <Button theme="default" size="small" shape="rectangle" style={{ height: '100%', width: '60px', marginLeft: 'auto', marginRight: '0px' }} onClick={miniWin}  >
          <MinimizeIcon />
        </Button>
        <Button theme="default" size="small" shape="rectangle" style={{ height: '100%', width: '60px', marginLeft: '0', marginRight: '0px' }} onClick={maxWin}  >
          {isMaxWin ?  <MaximizeRestoreIcon size={24} /> : <MaximizeIcon  size={20} />}
        </Button>
        <Button theme="danger" size="small" shape="rectangle" style={{ height: '100%', width: '60px', marginRight: '0px' }} onClick={closeWin}  >
          <CloseIcon />
        </Button>
      </div>
      <div className="w-full  flex" style={{ height:windowSize ? (windowSize.innerHeight-32)+'px' : '688px' }} >
        <div className=" h-full  py-[10px] inline-block" style={{width: windowSize ? (windowSize.innerWidth-423)+'px' : '66%'}} >
          <PowerChart></PowerChart>
        </div>
        <div className=" h-full w-[423px]  inline-block "  >
          <div className="flex flex-col justify-start items-start h-full w-full">
            <MaxPart />
            <Divider align="left" ><span className="text-xl">配置</span></Divider>
            <div className="flex pl-2  w-full relative">
              <span style={{ lineHeight: '32px' }} className="mx-2 w-22 text-gray-600 text-sm text-right  ">游戏遥测IP</span>
              <Input className="" style={{ width:' 60%' }} value={tempConfig.ip} onChange={(e) => { setTempConfig({ ...tempConfig, ip: e }) }} />

              {/* <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="1" /> */}
            </div>
            <div className="flex pl-2 mt-2 shrink-0 w-full ">
              <span style={{ lineHeight: '32px' }} className="mx-2 w-22 text-gray-600 text-sm  text-right">游戏遥测端口</span>
              <Input style={{ width: '60%'  }} value={tempConfig.port + ""} onChange={(e) => { setTempConfig({ ...tempConfig, port: Number(e) }) }} />
            </div>

            <div className="flex w-full pl-2 mt-2  justify-end px-2 pt-4">
              <Button theme="primary" onClick={saveConfig} >保存</Button>
            </div>
          </div>

        </div>
      </div>

    </main>

  );
}

export default memo(App);






const MaxPart: React.FC = memo(() => {
  // const [maxPowerObj, setMaxPowerObj] = useState({ max: 0, rpm: 0 });
  // const [maxTorqueObj, setMaxTorqueObj] = useState({ max: 0, rpm: 0 });
  const [maxDataItem, setMaxDataItem] = useAtom(maxDataAtom)
  const [realTimeData, setRealTimeData] = useAtom(realTimeDataAtom)


  useEffect(() => {

  }, [])


  return (
    <div className="flex pl-6 pt-2 relative  w-full">
      <div className="flex flex-col items-center">
        <Statistic title="最大马力" value={maxDataItem.power.max} unit="HP" color="red" />
        <div className="  text-[#d54941]">at {maxDataItem.power.rpm} rpm</div>
      </div>

      <span className="mx-4"></span>
      <div className="flex flex-col items-center">
        <Statistic title="最大扭矩" value={maxDataItem.torque.max} unit="lbf·ft" color="blue" />
        <span className="   text-[#0052da] ">at {maxDataItem.torque.rpm} rpm</span>
      </div>


      <span className="mx-4"></span>
      <Statistic title="当前转速" value={realTimeData?.current_engine_rpm || 0} unit="rpm" color="orange" />
    </div>
  )
})

