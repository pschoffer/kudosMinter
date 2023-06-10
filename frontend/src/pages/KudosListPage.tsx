import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useFirestore } from 'reactfire';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { NFTMetadata } from '../utils/shared/models';
import { Collections } from '../utils/enums';
import { fromFirebaseDocs } from '../utils/firebase';

export default function KudosListPage() {
    const [kudos, setKudos] = React.useState<NFTMetadata[]>([]);
    const db = useFirestore();


    useEffect(() => {
        const q = query(collection(db, Collections.Metadata), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const newKudos = fromFirebaseDocs<NFTMetadata>(querySnapshot.docs)
            setKudos(newKudos);
        });
    }, [db])


    const baseLink = window.location.origin + '/kudos/';
    return (
        <div>
            <Header />
            <div className='container'>
                {kudos.map(kudo => <a key={kudo.id || ''} href={baseLink + kudo.id}>
                    <div className='row m-0 kudos-link' >
                        <div className='col v-center'>
                            <h3>{kudo.name}</h3>
                        </div>
                        <div className='col'>
                            <img src={kudo.image} alt={kudo.name} className='kudos-preview' />
                        </div>
                        <div className='col v-center'>
                            <p>{kudo.description}</p>
                        </div>
                    </div>
                </a>)}
            </div>
        </div>
    )
}
