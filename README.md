# Tiến độ hiện tại 👋
90% App
### 1. Chỉnh sửa lại phần Auth ( sửa forgot, thêm phần reset pass )
### 2. Thêm phần notification
### 3. Chỉnh sửa lại phần đặt hàng, mua hàng, đặt mua thành công, hủy đơn hàng 
### 4. Mở rộng
#### Option dễ làm, hiệu quả cao

##### 1. Loading + retry cho API
Khi fetch lỗi hoặc chậm, hiện:

skeleton/loading đẹp
nút “Thử lại”
thông báo “Không tải được dữ liệu”

Cái này tăng cảm giác app rất nhiều.

##### 2. Empty state đẹp hơn
Ví dụ:

giỏ hàng trống
không có kết quả tìm kiếm
không có địa chỉ
không có news

Thêm icon + text + nút điều hướng.

##### 3. Toast/feedback đồng bộ
Hiện app đã có toast vài chỗ, nhưng nên đồng bộ:

thêm giỏ hàng thành công
lưu profile thành công
lưu địa chỉ thành công
lỗi mạng
thanh toán thành công/thất bại

##### 4. Pull to refresh
Cho:

Home
Store list
Cart
News

Nhìn app “thật” hơn ngay.

Option nâng chất UX/UI

##### 5. Animation mượt hơn
Ví dụ:

card bấm có scale nhẹ
banner auto slide
header thu nhỏ khi scroll
transition vào detail mượt hơn

##### 6. Search/filter tốt hơn
Thêm:

tìm theo tên
lọc theo giá
lọc theo loại xe
sắp xếp tăng/giảm giá

Cái này rất dễ ghi điểm.

##### 7. Ảnh fallback chuẩn
Nếu ảnh lỗi:

hiện ảnh mặc định
không vỡ layout
không hiện khung trắng xấu

##### 8. Đồng bộ theme mạnh hơn
Hiện đã có dark mode, nhưng có thể làm đều hơn:

bottom tab
modal
loading
card states
text phụ
empty state
Option tăng điểm kỹ thuật

##### 9. Cache dữ liệu bằng AsyncStorage
Ví dụ cache:

categories
news
featured
stores

Lần mở sau tải nhanh hơn, nhìn chuyên nghiệp hơn.

##### 10. Tách service/API rõ hơn
Nếu chưa sạch hẳn, tách:

categoryService
newsService
productService
storeService

Giảng viên nhìn code sẽ thích hơn.

##### 11. Custom hook
Ví dụ:

useFetchNews
useFeaturedProducts
useStores

Code sạch, dễ bảo trì.

##### 12. Error boundary / safe handling
Tránh app crash khi:

API lỗi
ảnh lỗi
dữ liệu null
param route thiếu
Option ghi điểm rất mạnh khi demo

##### 13. Map cho địa chỉ nhận hàng hoặc cửa hàng
Đây là một trong những option đáng tiền nhất:

chọn vị trí trên bản đồ
hoặc mở map tới cửa hàng

Giảng viên thường rất ấn tượng.

##### 14. Theo dõi trạng thái đơn hàng
Ví dụ trong cart/order:

đã đặt
đang xác nhận
đang giao
hoàn tất

Nếu có timeline thì càng đẹp.

##### 15. Favorite / wishlist
Cho người dùng lưu xe yêu thích.

##### 16. Notification mock
Ví dụ chuông trên home bấm vào thấy:

ưu đãi mới
tin tức mới
trạng thái đơn hàng
Option nếu muốn app giống sản phẩm thật

##### 17. Đăng nhập giữ phiên
Mở app không phải login lại nếu token còn hợp lệ.

##### 18. Chỉnh sửa avatar thật
Chọn ảnh từ máy, lưu local hoặc upload.

##### 19. Form validation tốt hơn
Ví dụ:

email đúng định dạng
số điện thoại hợp lệ
không cho submit rỗng

##### 20. Pagination/lazy loading
Cho:

news
store list
sản phẩm ######
