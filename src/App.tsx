import { memo, useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { getCurrentWindow } from '@tauri-apps/api/window';


import PowerChart from "./chart";
import { Button, Divider, Input, MessagePlugin, Statistic } from "tdesign-react";
import { useAtom } from "jotai";
import { configAtom } from "./store";
import { getMsgOpt, sleep } from "./util";
import { CloseIcon, ForzaLogoIcon, MinimizeIcon } from "./icon/svg";

function App() {
  // const [ip, setIp] = useState('127.0.0.1');
  const [config, setConfig] = useAtom(configAtom)
  const [tempConfig, setTempConfig] = useState<typeof config>({ ...config })
  const [initCount, setInitCount] = useState(0)


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

  useEffect(() => {
    sleep(50).then(() => {
      setTempConfig({ ...config })
    })

  }, [config])

  return (
    <main className="w-full h-[720px]">
      <div data-tauri-drag-region className=" h-8 w-full bg-gray-100 relative z-50 flex items-center">
        <span className={'ml-2'}><ForzaLogoIcon size={40} /></span>
        <span data-tauri-drag-region className="ml-2 text-stone-800 select-none">极限竞速马力曲线绘制工具</span>
        <Button theme="default" size="small" shape="rectangle" style={{ height: '100%', width: '60px', marginLeft: 'auto', marginRight: '0px' }} onClick={miniWin}  >
          <MinimizeIcon />
        </Button>
        <Button theme="danger" size="small" shape="rectangle" style={{ height: '100%', width: '60px', marginRight: '0px' }} onClick={closeWin}  >
          <CloseIcon />
        </Button>
      </div>
      <div className="w-full h-[688px] flex" >
        <div className=" h-full w-2/3 py-[10px] inline-block">
          <PowerChart></PowerChart>
        </div>
        <div className=" h-full w-1/3  inline-block ">
          <div className="flex flex-col justify-start items-start h-full w-full">
            <MaxPart />
            <Divider align="left" ><span className="text-xl">配置</span></Divider>
            <div className="flex pl-2">
              <span style={{ lineHeight: '32px' }} className="mx-2 w-18 text-gray-600 text-sm">游戏遥测IP</span>
              <Input style={{ width: 100 }} value={tempConfig.ip} onChange={(e) => { setTempConfig({ ...tempConfig, ip: e }) }} />
              <span style={{ lineHeight: '32px' }} className="mx-2 w-22 text-gray-600 text-sm">游戏遥测端口</span>
              <Input style={{ width: 80 }} value={tempConfig.port + ""} onChange={(e) => { setTempConfig({ ...tempConfig, port: Number(e) }) }} />
              {/* <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="1" /> */}
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
  const [maxPowerObj, setMaxPowerObj] = useState({ max: 0, rpm: 0 });
  const [maxTorqueObj, setMaxTorqueObj] = useState({ max: 0, rpm: 0 });

  useEffect(() => {

  }, [])


  return (
    <div className="flex pl-6 pt-2 relative">
      <div className="flex flex-col items-center">
        <Statistic title="最大马力" value={maxPowerObj.max} unit="HP" color="red" />
        <div className="  text-[#d54941]">at {maxPowerObj.rpm} rpm</div>
      </div>

      <span className="mx-4"></span>
      <div className="flex flex-col items-center">
        <Statistic title="最大扭矩" value={maxTorqueObj.max} unit="Nm" color="blue" />
        <span className="   text-[#0052da] ">at {maxTorqueObj.rpm} rpm</span>
      </div>


      <span className="mx-4"></span>
      <Statistic title="当前转速" value={82.76} unit="rpm" color="orange" />
    </div>
  )
})

