# AccountSetupDoorwayDetailImageUpload

A stateful component that can be used to upload an image to the server. The user has the opportunity
to upload an image, or on mobile take a photo with the camera. Once the image has been fetched, a
callback is fired with the image data so that it can be stored and later submitted to a server.

The component only allows uploading a single file, attempting to upload more than one file will call
`onMultipleFileUpload`

## Component Props
- `value: string` - Path to the currently selected file in the uploading widget.
- `onChange: (file: File | null) => any` - Called when the user uploads a file. The resulting browser
  `File` object is returned. If the user clears the file uploader by cancelling the upload, this
  will return `null`.
- `onMultipleFileUpload: () => any` - Called when the user attempts to upload multiple files.
