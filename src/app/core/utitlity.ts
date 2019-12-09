// export function cloneArray(arrayToBeCloned: [{}]) {

//     return arrayToBeCloned.map((memberToBeCloned) => {
//         return {
//           ...memberToBeCloned
//         };
// }

// export function cloneNonPrimitiveArray(arrayToBeCloned: [{}]) {
    
//     return arrayToBeCloned.map((memberToBeCloned) => {
        
//         return Object.assign({}, {...memberToBeCloned});
//     }
// }

export class Utility {

    public static cloneArray<TObject>(arrayToBeCloned : TObject[]) : TObject[]
    {
        return arrayToBeCloned.map((memberToBeCloned : TObject) => {
            return Object.assign({}, memberToBeCloned);
        });
    }
    
}