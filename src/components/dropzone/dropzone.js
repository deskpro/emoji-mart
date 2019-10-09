import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function CustomDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    props.onAcceptedFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="fa-picker-dropzone">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {!isDragActive ? (
          <div>
            <div className="choose">
              <i className="far fa-file-image" />
              Upload an image
            </div>
            <div className="or">or</div>
            <div className="dnd">
              <i className="far fa-copy" />
              drag and drop
            </div>
          </div>
        ) : (
          <p className="drop">Drop the files here ...</p>
        )}
      </div>
    </div>
  )
}
