import React from 'react';
import ReactDOM from 'react-dom';
import BaseModal from './BaseModal';

export default function PortalModal(props) {
  if (typeof document === 'undefined') return null;
  const modalNode = (
    <BaseModal {...props}>{props.children}</BaseModal>
  );
  return ReactDOM.createPortal(modalNode, document.body);
}
