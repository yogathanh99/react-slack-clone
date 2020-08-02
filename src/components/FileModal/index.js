import React, { useState } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

const FileModal = (props) => {
  const [file, setFile] = useState(null);
  const [authorized] = useState(['image/jpeg', 'image/png', 'image/jpg']);
  const { modal, closeModal, uploadFile } = props;

  const handleChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const isAuthor = (filename) => authorized.includes(mime.lookup(filename));

  const handleSendFile = () => {
    if (file !== null) {
      if (isAuthor(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };

        uploadFile(file, metadata);
        closeModal();
        setFile(null);
      }
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={handleChange}
          fluid
          label='File type: jpg, png'
          name='file'
          type='file'
        />
      </Modal.Content>
      <Modal.Actions>
        <Button inverted color='green' onClick={handleSendFile}>
          <Icon name='checkmark' /> Send
        </Button>
        <Button inverted color='red' onClick={closeModal}>
          <Icon name='remove' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
