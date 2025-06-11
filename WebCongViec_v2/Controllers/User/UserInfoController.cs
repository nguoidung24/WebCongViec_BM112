using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;

namespace WebCongViec_v2.Controllers.User
{
    public class UserInfoController : Controller
    {

        private Bm112Context _context;
        public UserInfoController()
        {
            _context = new Bm112Context();
        }

        [Route("/UserInfo")]
        public IActionResult UserInfo(string phone, string email, string dob, string taxId, string cccd,
                                         string issueDate, string issuePlace, string permanentAddress,
                                         string currentAddress, string shift, string firstWorkDate,
                                         string projects, string bankAccount, string bankName, string? btnSubmit)
        {
            string ID = HttpContext.Session.GetString("ID");

            string? DisplayName = HttpContext.Session.GetString("DisplayName");
            ViewBag.Name = ID + " - " + DisplayName;
            var infoNhanSu = _context.Nhansus.Where(row => row.IdNhanSu.ToString().Equals(ID)).FirstOrDefault();
            if(infoNhanSu != null)
                ViewBag.InfoNhanSu = infoNhanSu.ThongTinCaNhan.Replace("_$|$_", "</br>");
            if (btnSubmit != null)
                if (btnSubmit.Equals("ok")){
                    string result = $@"
                        <p class='thongtinnhansu'>
                            Số điện thoại: <span>{phone}</span><br>
                            Email: <span>{email}</span><br>
                            Ngày sinh: <span>{dob}</span><br>
                            Mã số thuế theo CCCD: <span>{taxId}</span><br>
                            CCCD: <span>{cccd}</span><br>
                            Ngày cấp: <span>{issueDate}</span><br>
                            Nơi cấp: <span>{issuePlace}</span><br>
                            Địa chỉ HKTT: <span>{permanentAddress}</span><br>
                            Nơi ở hiện tại: <span>{currentAddress}</span><br>
                            Ca làm việc: <span>{shift}</span><br>
                            Ngày làm việc đầu tiên: <span>{firstWorkDate}</span><br>
                            Các dự án đã tham gia tại TDS: <span>{projects}</span><br>
                            Số tài khoản ngân hàng: <span>{bankAccount}</span><br>
                            Ngân hàng: <span>{bankName}</span>
                        </p>";


                    var nhanSu = _context.Nhansus.Where(row => row.IdNhanSu.ToString().Equals(ID)).FirstOrDefault();
                    if(nhanSu != null)
                    {
                        nhanSu.ThongTinCaNhan = result;
                        nhanSu.Status = 1;
                        _context.SaveChanges();
                        return RedirectToAction("UserInfo", "UserInfo", new { message = "Đã cập nhật", messageType = "success" });


                    }
                    return RedirectToAction("UserInfo", "UserInfo", new { message = "Không thành công", messageType = "warning" });


                }


            return View();
        }
    }
}
