
export function fromFirebaseDoc<Type>(doc: any): Type {
    const data = doc.data();

    const convertedData: any = {
        id: doc.id,
    };
    if (data) {

        for (const key of Object.keys(data)) {
            let value = data[key];
            if (typeof value === 'object' && value?.toDate) {
                value = value.toDate();
            }
            convertedData[key] = value;
        }
    }

    return convertedData;
}

export function fromFirebaseDocs<Type>(docs: Array<any>): Array<Type> {
    return docs.map(doc => fromFirebaseDoc<Type>(doc));
}