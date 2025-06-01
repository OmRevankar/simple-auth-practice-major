import React from 'react'

const ButtonComponent = (props) => {
  return (
    <button className='bg-amber-400 rounded-sm border-2 p-2 shadow-md w-fit text-black font-semibold' onClick={props.handleClick}>
        <p>{props.name}</p>
    </button>
  )
}

export default ButtonComponent
