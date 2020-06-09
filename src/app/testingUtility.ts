export const createSpyObj = (
  methodNames: string[]
): { [key: string]: jest.Mock<any> } => {
  const obj: any = {};

  methodNames.forEach((methodName) => {
    obj[methodName] = jest.fn();
  });

  return obj;
};
