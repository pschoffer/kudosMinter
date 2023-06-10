import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import { NFTMetadata } from '../utils/shared/models';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { Collections } from '../utils/enums';
import { fromFirebaseDoc } from '../utils/firebase';

interface Props {
    kudosId: string;
}

export default function KudosPage(props: Props) {
    const [kudo, setKudo] = useState<NFTMetadata | null>(null);
    const db = useFirestore();

    useEffect(() => {
        return onSnapshot(doc(db, Collections.Metadata, props.kudosId), (doc) => {
            setKudo(fromFirebaseDoc<NFTMetadata>(doc));
        });
    }, [db, props.kudosId])

    if (!kudo) {
        return <div>
            <Header />
            <div className='center mt-2'>

                <div className="spinner-border text-primary" role="status" />
            </div>
        </div>
    }

    return (
        <div>
            <Header />

            <div className='container'>
                <h3>{kudo.name}</h3>
                <div>
                    <img src={kudo.image} alt={kudo.name} className='kudos-preview' />
                </div>
                <p>{kudo.description}</p>


            </div>
        </div>
    )
}
