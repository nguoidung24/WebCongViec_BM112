namespace WebCongViec_v2.Middleware
{
    public class Auth
    {
        protected HttpContext context;
        protected RequestDelegate next;
        protected string? isLogin;
        protected string? role;
        protected string nextPath;
        public Auth(HttpContext httpContext, RequestDelegate requestDelegate)
        {
            this.context = httpContext;
            this.next = requestDelegate;
            this.isLogin = this.context.Session.GetString("isLogin");
            this.role = this.context.Session.GetString("role");
            this.nextPath = this.context.Request.Path.ToString().ToLower();
        }


        public bool Ok()
        {

            if (this.isLogin != null && this.isLogin.Equals("1"))
            {
                return this.HandleLoginSuccess();
            }
            else
            {
                return this.HanldeLoginFail();
            }
        }

        bool HandleLoginSuccess()
        {
            this.HandleUserRole();

            if (this.nextPath != null && this.nextPath.Equals("/chamcong/login"))
            {
                this.context.Response.Redirect("/chamcong/");
            }
            else
            {

                return true;
            }

            return false;
        }

        bool HanldeLoginFail()
        {
            if (!this.nextPath.Equals("/chamcong/login"))
            {
                this.context.Response.Redirect("/chamcong/login");
            }
            else
            {
                return true;
            }

            return false;
        }

        void HandleUserRole()
        {
            var HasInfo =  this.context.Session.GetString("HasInfo");
            var userrole =  this.context.Session.GetString("userrole");
            if (this.nextPath != null)
            {
                if (this.role != null && this.role.Equals("1"))
                {
                    if (this.GetUsersRoles().Contains(this.nextPath))
                    {
                        this.context.Response.Redirect("/chamcong/");
                    }
                }

                if (this.role != null && this.role.Equals("0"))
                {
                    if(userrole != null && userrole.Equals("4"))
                        if (this.nextPath.Equals("/chamcong/userscontroller/chamcong"))
                        {
                            this.context.Response.Redirect("/chamcong/homeusers?messageType=warning&message="+ Uri.EscapeDataString("Bạn bị khóa chấm công 🚫"));
                        }                    
                    if(HasInfo != null && HasInfo.Equals("0"))
                        if (this.nextPath.Equals("/chamcong/userscontroller/chamcong"))
                        {
                            this.context.Response.Redirect("/chamcong/homeusers?messageType=warning&message="+ Uri.EscapeDataString("Bạn Cần Bổ Sung Thông Tin Cá Nhân"));
                        }

                    if (!this.GetUsersRoles().Contains(this.nextPath))
                    {
                        this.context.Response.Redirect("/chamcong/homeusers");
                    }
                }

                /*if (this.GetAdminRoles().Contains(this.nextPath))
                {
                    if (this.role != null && !this.role.Equals("1"))
                    {
                        this.context.Response.Redirect("/chamcong/homeusers");
                    }
                }

                if (this.GetUsersRoles().Contains(this.nextPath))
                {
                    if (this.role != null && !this.role.Equals("0"))
                    {
                        this.context.Response.Redirect("/chamcong/");
                    }
                }*/

            }
        }

        List<string> GetAdminRoles()
        {
            return new List<string> {  };
        }
        List<string> GetUsersRoles()
        {
            return new List<string> { "/chamcong/homeusers", "/chamcong/userscontroller/chamcong", "/chamcong/userinfo" };
        }
    }
}
