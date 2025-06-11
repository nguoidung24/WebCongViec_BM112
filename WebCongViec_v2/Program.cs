using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using WebCongViec_v2.Middleware;
using WebCongViec_v2.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // GDPR compliance

});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // Upload file up to 100MB
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(4);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});


// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();

app.UseAuthorization();

app.Use(async (context, next) =>
{
    if (new Auth(context, next).Ok())
    {
        await next(context);
    }
});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
    );

//app.UsePathBase("/chamcong/");
app.UseRouting();

app.Run();
