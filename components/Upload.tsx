import { useState, Fragment, useMemo } from 'react';
import RCUpload from 'rc-upload';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const UploadStatus = {
  Uploading: 'uploading',
  Success: 'success',
  Error: 'error',
};
const DEFAULT_ACCEPT = '.png,.jpg,.jpeg,.gif';
const timestamp = new Date().getTime();

function UploadComponent({ config }) {
  const [isResultBlock, setIsResultBlock] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(UploadStatus.Uploading);
  const [errorMessage ,setErrorMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [copied, setCopied] = useState(false);


  const {
    accessKeyId,
    secretAccessKey,
    endpoint,
    region,
    bucket,
    fileDomain,
    renameFileName,
    fileAccept,
  } = config;

  const client = new S3Client({
    region: region === '' ? 'auto' : region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const getFileName = (file) => {
    const rawFileName = file.name;
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    // @ts-ignore
    month = month < 10 ? `0${month}` : month;
    let newFileName = `${year}/${month}/${rawFileName}`;

    if (renameFileName === true) {
      newFileName = `${year}/${month}/${timestamp}-${rawFileName}`;
    }
    return {
      name: newFileName,
      url: `${fileDomain}/${newFileName}`,
    };
  };

  const uploaderDisabled = useMemo(() => {
    let result = true;
    const checkFiled = ['accessKeyId', 'secretAccessKey', 'endpoint', 'bucket'];
    result = checkFiled.some((key) => config[key] === '');
    return result;
  }, [config]);

  const rcUploadProps = {
    type: 'drag',
    accept: fileAccept === '' ? DEFAULT_ACCEPT : fileAccept,
    className: 'w-full h-full block',
    onSuccess(file) {
      setUploadStatus(UploadStatus.Success);
      const { url } = getFileName(file);
      setFileUrl(url);
    },
    onProgress() {
      setUploadStatus(UploadStatus.Uploading);
    },
    onError(err) {
      setUploadStatus(UploadStatus.Error);
      setErrorMessage(err.message || '出现未知错误.');
      console.error('onError', err);
    },
    customRequest({
      file,
      onError,
      onProgress,
      onSuccess,
    }) {
      setIsResultBlock(true);
      setUploadStatus(UploadStatus.Uploading);
      const input = {
        Bucket: bucket,
        Key: getFileName(file).name,
        ContentType: file.type,
        Body: file,
      };
      const parallelUploads3 = new Upload({
        client,
        params: input,
        // (optional) concurrency configuration
        queueSize: 4,
        // (optional) size of each part, in bytes, at least 5MB
        partSize: 1024 * 1024 * 5,
        // (optional) when true, do not automatically call AbortMultipartUpload when
        // a multipart upload fails to complete. You should then manually handle
        // the leftover parts.
        leavePartsOnError: false,
      });
    
      parallelUploads3.on('httpUploadProgress', (progress) => {
        onProgress(progress);
      });
      parallelUploads3.done().then((result) => {
        onSuccess(file);
      }).catch(onError);
    },
  };

  const onCloseResultTab = () => {
    setIsResultBlock(false);
    setErrorMessage('');
    setFileUrl('');
    setCopied(false);
    setUploadStatus(UploadStatus.Uploading);
  };

  const onCopyClick = () => {
    setCopied(true);
  }

  const renderUploadSuccessFragment = () => {
    return (
      <Fragment>
        <div className="p-2 mb-2 text-sm text-green-800 rounded bg-green-50" role="alert">
          文件上传成功
        </div>
        <div className="border border-x-0 border-b-0 flex pt-2 flex gap-1">
          文件URL：
          <a className="flex-1 text-blue-400 underline" href={fileUrl} target='_blank'>{fileUrl}</a>
          <CopyToClipboard text={fileUrl} onCopy={onCopyClick}>
            <button className="px-2 py-1 text-xs font-medium text-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:outline-none focus:ring-blue-300">复制</button>
          </CopyToClipboard>
          { copied === true ? <span className="text-red-800">Copied.</span> : null }
        </div>
      </Fragment>
    );
  };

  const renderResultBlock = () => {
    return (
      <div  className="border border-gray-200 p-2 text-sm rounded">
        <div className="flex justify-end"><button className="py-1.5 px-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-100" onClick={onCloseResultTab}>关闭</button></div>
        { uploadStatus === UploadStatus.Uploading ? 
            <div className="p-2 text-sm text-gray-800 rounded bg-gray-50 mb-3" role="alert">正在上传中...</div> : (
              uploadStatus === UploadStatus.Success ? renderUploadSuccessFragment() :
                <div className="rounded bg-red-300 border border-red-500 p-2">{ errorMessage }</div>)
        }
      </div>
    );
  };

  const renderUploadBlock = () => {
    return (
      <div className="border border-dashed border-gray-200 rounded flex">
        <div className="w-36 p-2 flex justify-center items-center">
          <svg className="text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><g><path d="M14.966 7.211a2.91 2.91 0 00-2-.68 4.822 4.822 0 00-9.243-1.147A3.41 3.41 0 001.3 6.18 3.65 3.65 0 000 8.938a3.562 3.562 0 003.554 3.555H6.5v-1H3.547A2.559 2.559 0 011 8.938a2.64 2.64 0 01.943-1.992 2.413 2.413 0 012.032-.527l.435.075.13-.422a3.821 3.821 0 017.47 1.016l.017.57.563-.091a2.071 2.071 0 011.729.404A2.029 2.029 0 0115 9.508a1.987 1.987 0 01-1.985 1.985h-.032c-.061.001-.428.006-2.483.006v1c1.93 0 2.392-.004 2.515-.007a3.01 3.01 0 001.951-5.282v.001z"></path><path d="M10.95 9.456l-2.46-2.5-2.46 2.5.712.701L7.99 8.89v3.62h1v-3.62l1.248 1.268.713-.701z"></path></g></svg>
        </div>
        <div className="flex-1 pt-14 px-2">
          {
            uploaderDisabled === true ? <div className="p-2 text-sm text-red-800 rounded bg-red-50 w-full" role="alert"> 请先配置 S3 参数。</div> :
                  <RCUpload {...rcUploadProps}>
                    <div className="flex text-base">
                      <span>Drag and drop or&nbsp;&nbsp;</span>
                      <span className="text-blue-600">select from computer</span>
                    </div>
                  </RCUpload>
          }
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <div className="p-2 mb-2 text-sm text-blue-800 rounded bg-blue-50" role="alert">
        目前仅支持一次上传一个文件。
      </div>
      {
        isResultBlock ? renderResultBlock() : renderUploadBlock()
      }
    </Fragment>
  );
}
export default UploadComponent;