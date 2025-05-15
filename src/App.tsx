import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";


import PowerChart from "./chart";
import { Button, Divider, Input, Statistic } from "tdesign-react";
import { useAtom } from "jotai";
import { configAtom } from "./store";

function App() {
  const [ip, setIp] = useState('127.0.0.1');
  const [config, setConfig] = useAtom(configAtom)
  const [maxPowerObj, setMaxPowerObj] = useState({ max: 500, rpm: 4666 });
  const [maxTorqueObj, setMaxTorqueObj] = useState({ max: 1000, rpm: 7666 });



  return (
    <main className="w-full h-[700px] flex">
      <div className=" h-full w-2/3 py-[10px] inline-block">
        <PowerChart></PowerChart>
      </div>
      <div className=" h-full w-1/3  inline-block ">
        <div className="flex flex-col justify-start items-start h-full w-full">
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
          <Divider align="left" ><span className="text-xl">配置</span></Divider>
          <div className="flex pl-2">
            <span style={{ lineHeight: '32px' }} className="mx-2 w-4 text-gray-600 text-sm">IP</span>
            <Input style={{ width: 160 }} value={ip} />
            <span style={{ lineHeight: '32px' }} className="mx-2 w-22 text-gray-600 text-sm">游戏遥测端口</span>
            <Input style={{ width: 80 }} defaultValue="8000" />
            {/* <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="0" />
            <span style={{ lineHeight: '32px' }} className="mx-2"> . </span>
            <Input style={{ width: 50 }} defaultValue="1" /> */}
          </div>
          <div className="flex w-full pl-2 mt-2  justify-end px-2 pt-4">
            <Button>保存</Button>
          </div>
        </div>

      </div>
    </main>

  );
}

export default App;
