//using react-dropzone: Newver ReInvent the wheel , just see the documentation and refer.
import React, {useCallback, useState} from 'react'
import { FileWithPath,useDropzone} from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void,
    mediaUrl: string
}


const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState('');

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            // Do something with the files
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        }, [file]
    )

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/*' : ['.png', '.jpg' , '.jpeg' , '.svg']
        }
    })
    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
          <input {...getInputProps()} className='cursor-pointer'/>
          {
            fileUrl ? (
                <>
                <div className='flex flex-1 justify-center w-full p-5 lg:p-5'>
                    <img src={fileUrl} alt="" className='file_uploader-img'/>
                    <p className='file_uploader-label'>Click or Drag to Replace.</p>
                </div>
                </>
            ) : (
                <div className='file_uploader-box'>
                    <img src="/assets/icons/file-upload.svg" alt="" width={96} height={76}/>
                    <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                    <p className='text-light-4 small-regular mb-6'>SVG,JPEG,JPG</p>
                    <Button className='shad-button_dark_4'>Select from device</Button>
                </div>
            )
          }
        </div>
      )
}

export default FileUploader