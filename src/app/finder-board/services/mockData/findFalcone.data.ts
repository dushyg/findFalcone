export class FindFalcone {
  public static successResponse = {
    error: '',
    planet_name: 'Donlon',
    status: 'success',
  };

  public static failureResponse = {
    status: 'false',
  };

  public static errorResponse = {
    error: 'Token not initialized. Please get a new token with the /token API',
  };

  public static exceptionResponse = 'Communication exception';
}
