import copyImg from '../assets/images/copy.svg';

import toast, { Toaster } from 'react-hot-toast';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(props.code)
    toast.success('Room password copied to the clipboard');
  }

  return (
    <>
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy room password" />
        </div>
        <span>{props.code}</span>
      </button>
    <Toaster />
    </>
  )
}