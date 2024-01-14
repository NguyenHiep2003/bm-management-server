export const enum ErrorMessage {
  INVALID_TOKEN = 'Tài khoản chưa được xác thực',
  FORBIDDEN_RESOURCE = 'Bạn không có quyền truy cập vào nguồn này',
  PEOPLE_ID_REQUIRED = 'Thiếu trường mã cư dân',
  EMAIL_NOT_MATCH = 'Email không tương thích với mã cư dân hoặc cư dân không tồn tại',
  INTERNAL_SERVER_ERROR = 'Lỗi hệ thống',
  PEOPLE_NOT_FOUND = 'Cư dân không tồn tại',
  TEMPORARY_ABSENT_NOT_FOUND = 'Không tìm thấy thông tin trong danh sách cư dân tạm vắng',
  UPDATE_RESIDENCY_NOT_CHANGE = 'Cập nhật không thành công vì trạng thái cư trú không thay đổi',
  TIME_NOT_SUITABLE = 'Thông tin về thời gian không chính xác',
  WRONG_CREDENTIAL = 'Tài khoản không tồn tại hoặc mật khẩu không chính xác',
  WRONG_PASSWORD = 'Mật khẩu không đúng',
  FEE_NOT_FOUND = 'Khoản phí không tồn tại',
  EXIST_EMAIL = 'Email đã được sử dụng',
  EXIST_APARTMENT = 'Căn hộ đã tồn tại',
  APARTMENT_NOT_FOUND = 'Căn hộ không tồn tại',
  CANT_REGISTER_HOUSEHOLDER = 'Không thể đăng ký chủ hộ mới',
  HOUSEHOLD_NOT_FOUND = 'Hộ gia đình không tồn tại',
  CANNOT_DELETE_HOUSEHOLDER_THIS_WAY = 'Không thể xóa chủ hộ, thay vào đó hãy xóa hộ gia đình',
  BILL_EXIST = 'Hóa đơn tháng này đã được tạo',
  EXPIRED_FEE_OR_TOO_EARLY_TO_DONATE = 'Phí đã quá hạn thu hoặc chưa đến ngày thu',
  BILL_NOT_FOUND = 'Không có hóa đơn',
  BILL_HAVE_BEEN_PAID = 'Hóa đơn đã được thanh toán trước đó',
  MONEY_NOT_SUITABLE = 'Số tiền nộp không phù hợp',
  BAD_REQUEST = 'Thông tin cung cấp không chính xác',
  CANNOT_CHANGE_RELATION = 'Không thể thay đổi mối quan hệ với chủ hộ do không tìm thấy nhân khẩu hoặc người này đang là chủ hộ',
  EXIST_PEOPLE_CITIZEN_ID = 'Số căn cước công dân đã tồn tại',
  EXIST_DEBT = 'Hộ vẫn còn dư nợ không thể xóa',
  VEHICLE_EXIST = 'Phương tiện đã được đăng ký trước đó',
  FEE_EXIST = 'Phí đã tồn tại',
  NOT_SUITABLE_NAME_AND_UNIT = 'Tên phí và đơn vị không phù hợp',
  FEE_CANNOT_BE_UPDATED_THIS_WAY = 'Phí này không thể thay đổi theo cách này',
  FEE_CANNOT_BE_DELETE_THIS_WAY = 'Phí này không thể xóa theo cách này',
}
