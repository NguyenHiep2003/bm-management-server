export const enum ErrorMessage {
  PEOPLE_NOT_FOUND = 'This people does not exist',
  REQUIRED_EMAIL = 'People must have email to be an admin',
  WRONG_CREDENTIAL = 'Wrong email or password',
  WRONG_PASSWORD = 'Wrong password',
  EXIST_EMAIL = 'This email already exist',
  EXIST_APARTMENT = 'This apartment already exist',
  APARTMENT_NOT_FOUND = 'This apartment does not exist',
  CANT_REGISTER_HOUSEHOLDER = 'Cannot register householder',
  MUST_CONTAIN_AT_LEAST_ONE_PEOPLE = 'Must contain at least one people to register',
  HOUSEHOLD_NOT_FOUND = 'This apartment does not have household',
  CANNOT_DELETE_HOUSEHOLDER_THIS_WAY = 'Cannot delete this way because this person is householder, try deleting household',
  PEOPLE_ALREADY_HAVE_ACCOUNT = 'This people already have an account',
}
