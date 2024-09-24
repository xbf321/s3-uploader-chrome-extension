import { useState } from 'react';
import classNames from 'classnames';
import { useStorage } from "@plasmohq/storage/hook"

import UploadComponent from '~components/Upload';
import ConfigComponent from '~components/Config';

import "./style.css"

const Tabs = {
  Uploader: 'uploader',
  Config: 'config',
};

const DEFAULT_CONFIG = {
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: '',
  region: 'auto',
  bucket: '',
  fileDomain: '',
  renameFileName: true,
  fileAccept: '.png,.jpg,.jpeg,.gif',
};

function IndexPopup() {
  const [currentTab, setCurrentTab] = useState(Tabs.Uploader);
  const [config, setConfig] = useStorage('config', DEFAULT_CONFIG);

  const tabs = [{
    key: 'uploader',
    title: '文件上传'
  }, {
    key: 'config',
    title: 'S3配置'
  }];

  const onTabClick = (tab) => {
    setCurrentTab(tab.key);
  };

  const onConfigChange = (result) => {
    setConfig(result);
  };

  return (
    <div className="p-2" style={{ width: 520 }}>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-2">
        <ul className="flex flex-wrap -mb-px">
          {
            tabs.map((tab) => {
              return (
                <li className="me-2" key={tab.key}>
                  <a className={classNames({
                    'cursor-pointer': true,
                    'inline-block': true,
                    'p-2': true,
                    'rounded-t-lg': true,
                    'border-b-2': true,
                    'border-transparent': tab.key !== currentTab,
                    'hover:text-gray-600': tab.key !== currentTab,
                    'hover:border-gray-300': tab.key !== currentTab,
                    'text-blue-600': tab.key === currentTab,
                    'border-blue-600': tab.key === currentTab,
                    'active': tab.key === currentTab,
                  })} onClick={ () => onTabClick(tab) }>{ tab.title }</a>
                </li>
              );
            })
          }
        </ul>
      </div>
      {
        currentTab === Tabs.Uploader ? <UploadComponent config={config} /> : null
      }
      {
        currentTab === Tabs.Config ? <ConfigComponent config={config} onConfigChange={onConfigChange} /> : null
      }
      <div className="text-right mt-2 text-blue-600">
        <a href="https://github.com/xbf321/s3-uploader-chrome-extension" target='_blank'>版本：v1.0.0</a>
      </div>
    </div>
  )
}
export default IndexPopup
