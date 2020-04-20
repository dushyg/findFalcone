export const createSpyObj = (methodNames: []): { [key: string]: jest.Mock<any> } => {
    const obj: any = {};

    // for (let i = 0; i < methodNames.length; i++) {
    //     obj[methodNames[i]] = jest.fn();
    // }
    methodNames.forEach((methodName) => {
        obj[methodName] = jest.fn();
    });

    return obj;
};
