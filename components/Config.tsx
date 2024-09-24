function ConfigComponent({ config, onConfigChange }) {

  const onChange = (key, value) => {
    const newConfig = {
      ...config,
      [key]: value,
    };
    onConfigChange(newConfig);
  }

  const fields = [{
    key: 'accessKeyId',
    label: 'accessKeyId',
    placeholder: '请在您的 S3 配置中，寻找 accessKeyId',
    description: '',
  }, {
    key: 'secretAccessKey',
    label: 'secretAccessKey',
    placeholder: '请在您的 S3 配置中，寻找 secretAccessKey',
    description: '',
  }, {
    key: 'endpoint',
    label: 'endpoint',
    placeholder: '请在您的 S3 配置中，寻找 endpoint',
    description: '',
  }, {
    key: 'region',
    label: 'region',
    placeholder: 'region',
    description: '（默认: auto）',
  }, {
    key: 'bucket',
    label: 'bucket',
    placeholder: '文件会存放至这里配置的 Bucket 中',
    description: '',
  }, {
    key: 'fileDomain',
    label: 'fileDomain',
    placeholder: '返回文件URL时，会自动加上这里配置的文件域名',
    description: '（文件域名）',
  }, {
    key: 'fileAccept',
    label: 'fileAccept',
    placeholder: '留空则为：.png,.jpg,.jpeg,.gif',
    description: '限制上传的文件格式',
  }];
  
  return (
    <div className="grid gap-2 mb-1">
      {
        fields.map((item) => {
          return (
            <div key={item.key}>
              <label className="block mb-1 text-sm font-medium text-gray-900">
                { item.label }
                { item.description ? <span className="ml-1 text-xs text-gray-300">{ item.description }</span> : null }
              </label>
              <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1" defaultValue={config[item.key] || ''} placeholder={item.placeholder} onChange={(e) => onChange(item.key, e.target.value)} />
            </div>
          );
        })
      }
      <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">重命名文件名称</label>
          <input type="checkbox" checked={config.renameFileName || false} onChange={e => onChange('renameFileName', e.target.checked)} />
          <span className="ml-1 text-xs text-gray-300">（建议勾选，避免相同名字，不同内容的文件被覆盖，拼接格式：[Year]/[Month]/[当前时间戳]-[原始文件名称]）</span>
      </div>
    </div>
  );
}
export default ConfigComponent;