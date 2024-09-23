import { useState, Fragment } from 'react';
import Uploader from 'rc-upload';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import "./style.css"

const UploadStatus = {
  Uploading: 'uploading',
  Success: 'success',
  Error: 'error',
};
function IndexPopup() {
  const [isResultTab, setIsResultTab] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(UploadStatus.Uploading);
  const [errorMessage ,setErrorMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const isRenameFileName = true;
  const imageDomain = 'http://www.xxx.com';

  const accessKeyId = '54af1ab4b8400710eb517dcb52f8eb9c';
  const secretAccessKey = '96c0bccb921d2d91ddc99a92042b13d242e5f6b561191117c9162aaea3d0bd38';
  const endpoint = 'https://114098f374cd65fc6bd947bd0a5eb654.r2.cloudflarestorage.com';
  const bucket = 'static-resource';
  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const getFileName = (file) => {
    const rawFileName = file.name;
    let newFileName = rawFileName;
    if (isRenameFileName) {
      newFileName = `${new Date().getTime()}-${newFileName}`;
    }
    return {
      name: newFileName,
      url: `${imageDomain}/${newFileName}`,
    };
  };

  const props = {
    type: 'drag',
    accept: '.png,.jpg,.jpeg,.gif',
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
      setIsResultTab(true);
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
      parallelUploads3.done().then(() => {
        onSuccess(file);
      }).catch(onError);
    },
  };

  const onCloseResultTab = () => {
    setIsResultTab(false);
    setErrorMessage('');
    setFileUrl('');
    setUploadStatus(UploadStatus.Uploading);
  };

  const renderUploadSuccessBlock = () => {
    return (
      <Fragment>
        <div className="rounded bg-green-300 border border-green-500 p-2 mb-3">文件已经成功上传。</div>
        <div className="border border-x-0 border-b-0 flex">
          图片URL：
          <a className="flex-1 text-blue-400 underline" href={fileUrl} target='_blank'>{fileUrl}</a><button className="ml-1 bg-blue-500 text-white px-1 rounded text-sm">复制</button>
        </div>
      </Fragment>
    );
  };

  const renderResultTab = () => {
    return (
      <div  className="border border-gray-200 p-2 text-sm rounded">
        <div className="flex justify-end"><button className="bg-gray-200 p-1 px-2 rounded text-sm mb-2" onClick={onCloseResultTab}>关闭</button></div>
        { uploadStatus === UploadStatus.Uploading ? <div className="font-base mb-3">正在上传中...</div> : (
          uploadStatus === UploadStatus.Success ? renderUploadSuccessBlock() : <div className="rounded bg-red-300 border border-red-500 p-2">{ errorMessage }</div>
        )}
      </div>
    );
  };

  const renderUploadTab = () => {
    return (
      <div className="border border-dashed border-gray-200 rounded flex">
        <div className="w-36 p-2 flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><g><path d="M14.966 7.211a2.91 2.91 0 00-2-.68 4.822 4.822 0 00-9.243-1.147A3.41 3.41 0 001.3 6.18 3.65 3.65 0 000 8.938a3.562 3.562 0 003.554 3.555H6.5v-1H3.547A2.559 2.559 0 011 8.938a2.64 2.64 0 01.943-1.992 2.413 2.413 0 012.032-.527l.435.075.13-.422a3.821 3.821 0 017.47 1.016l.017.57.563-.091a2.071 2.071 0 011.729.404A2.029 2.029 0 0115 9.508a1.987 1.987 0 01-1.985 1.985h-.032c-.061.001-.428.006-2.483.006v1c1.93 0 2.392-.004 2.515-.007a3.01 3.01 0 001.951-5.282v.001z"></path><path d="M10.95 9.456l-2.46-2.5-2.46 2.5.712.701L7.99 8.89v3.62h1v-3.62l1.248 1.268.713-.701z"></path></g></svg>
        </div>
        <div className="flex-1">
          <Uploader {...props}>
            <div className="flex pt-14 pl-4 text-base">
              <span>Drag and drop or&nbsp;&nbsp;</span>
              <span className="text-blue-600">select from computer</span>
            </div>
          </Uploader>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2" style={{ width: 520 }}>
      {
        isResultTab ? renderResultTab() : renderUploadTab()
      }
    </div>
  )
}

export default IndexPopup
