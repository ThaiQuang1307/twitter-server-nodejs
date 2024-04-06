export const USERS_MESSAGES = {
  LOGIN_SUCCESSFULLY: 'Đăng nhập thành công',
  REGISTER_SUCCESSFULLY: 'Đăng ký thành công',
  LOGOUT_SUCCESSFULLY: 'Đăng xuất thành công',
  VALIDATION_ERROR: 'Lỗi validation',
  EMAIL_OR_PASWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  ACCESS_TOKEN: {
    REQUIRE: 'access_token là bắt buộc',
    IS_INVALID: 'access_token không hợp lệ'
  },
  REFRESH_TOKEN: {
    REQUIRE: 'refresh_token là bắt buộc',
    IS_INVALID: 'refresh_token không hợp lệ',
    NOT_EXIST: 'refresh_token đã được dùng hoặc không tồn tại'
  },
  NAME_VALIDATION: {
    REQUIRE: 'Tên là bắt buộc',
    LENGTH: 'Tên có độ dài 1 - 100 ký tự'
  },
  EMAIL_VALIDATION: {
    REQUIRE: 'Email là bắt buộc',
    EXIST: 'Email đã được đăng ký',
    FORMAT: 'Email không hợp lệ',
    NOT_EXIST: 'Email chưa được đăng ký'
  },
  PASSWORD: {
    REQUIRE: 'Mật khẩu là bắt buộc',
    FORMAT: 'Mật khẩu có độ dài 6 - 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ in hoa, 1 số, 1 ký tự đặc biệt'
  },
  CONFIRM_PASSWORD: {
    CONFIRM: 'Không trùng khớp với mật khẩu',
    REQUIRE: 'Xác nhận mật khẩu là bắt buộc',
    FORMAT:
      'Xác nhận mật khẩu có độ dài 6 - 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ in hoa, 1 số, 1 ký tự đặc biệt'
  },
  DATE_OF_BIRTH: {
    REQUIRE: 'Ngày sinh là bắt buộc',
    IS_ISO8601: 'Ngày sinh phải thuộc dạng ISO8601'
  }
} as const
