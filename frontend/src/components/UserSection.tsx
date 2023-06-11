import React from 'react'

interface Props {
    label: string;
    avatar?: string;
    name: string;
}

export default function UserSection(props: Props) {
    return (
        <div className='my-3'>

            <label className='label'>{props.label}</label>
            <div className='d-flex align-items-center'>
                {props.avatar && <img className="avatar" src={props.avatar} alt={props.name} />}
                <div className='bold ms-3'>{props.name}</div>
            </div>
        </div>
    )
}
