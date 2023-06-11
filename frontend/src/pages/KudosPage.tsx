import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import { NFTMetadata } from '../utils/shared/models';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { Collections } from '../utils/enums';
import { fromFirebaseDoc, parseAttributes } from '../utils/firebase';
import { Link, useParams } from 'react-router-dom';
import UserSection from '../components/UserSection';


export default function KudosPage() {
    const { kudosId } = useParams<{ kudosId: string }>();
    const [kudo, setKudo] = useState<NFTMetadata | null>(null);
    const db = useFirestore();

    useEffect(() => {
        if (kudosId) {
            return onSnapshot(doc(db, Collections.Metadata, kudosId), (doc) => {
                setKudo(fromFirebaseDoc<NFTMetadata>(doc));
            });
        }
    }, [db, kudosId])

    if (!kudo) {
        return <div>
            <Header />
            <div className='center mt-2'>
                <div className="spinner-border text-primary" role="status" />
            </div>
        </div>
    }

    const attributes = parseAttributes(kudo);
    return (
        <div>
            <Header />

            <div className='py-5' />
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 center'>
                        <img src={kudo.image} alt={kudo.name} className='kudos-preview' />
                    </div>
                    <div className='col-md-6'>
                        <h3>{kudo.name}</h3>

                        <UserSection label='FROM' name={attributes.from} avatar={attributes.fromAvatar} />
                        <UserSection label='TO' name={attributes.to} avatar={attributes.toAvatar} />

                        <label>MESSAGE</label>
                        <p>{attributes.message}</p>
                    </div>
                </div>

                <div className='center mt-5'>
                    <Link to='/'>
                        <button className='btn btn-outline-primary'>{'<< All Kudos'}</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
