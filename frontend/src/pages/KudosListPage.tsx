import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useFirestore } from 'reactfire';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { NFTMetadata } from '../utils/shared/models';
import { Collections } from '../utils/enums';
import { fromFirebaseDocs, parseAttributes } from '../utils/firebase';
import { Link } from 'react-router-dom';

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


    return (
        <div>
            <Header />
            <div className='container'>
                <div className='row'>

                    {kudos.map(kudo => {
                        const attributes = parseAttributes(kudo)
                        return <div key={kudo.id || ''} className='col-md-4 p-2 center kudos-list-item'>
                            <div className='content'>

                                <Link key={kudo.id || ''} to={'/kudos/' + kudo.id} >
                                    <img src={kudo.image} alt={kudo.name} className='kudos-preview' />


                                    <div className='details  p-1'>
                                        <h3>{kudo.name}</h3>
                                        <p>{attributes.from + " >> " + attributes.to}</p>
                                        <p className='mt-2 text-center bold bigger'>{attributes.message}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
