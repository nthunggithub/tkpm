
     function FIlter(b,c)
    {
        
      const TypeOfFields=b;
      const fields=c;
      let Category = document.getElementById("myBtnContainer").value;
      let xCategory= document.getElementById("myBtnContainer");
      let Author = document.getElementById("myBtnproducer").value;
      let xAuthor=document.getElementById("myBtnproducer");
      let Url=decodeURIComponent(window.location.href);
      window.alert(Url);
      let location=false;
      let ListCategory = [];
      let ListAuthor=[];
      for (i = 0; i < xCategory.options.length; i++) {
          ListCategory.push(xCategory.options[i].value);
      }
      for (i = 0; i < xAuthor.options.length; i++) {
          ListAuthor.push(xAuthor.options[i].value);
      }
      if(Url.search('search')>-1)
          location=true

      if(Url.search("Category")===-1&&Category!==undefined)
      {        
              if(Url[Url.search('products'+8)]===undefined)
              {
                  Url=Url+"?Category="+(Category);
              }
              else
              {
                  Url=Url+"&Category="+(Category);
              }
      }
      if(Url.search("Category")>-1&&Url.search(Category)===-1)
      {
          let backup;
          window.alert("Thay doi loai san pham");
          var i;
          for(i=0;i<ListCategory.length;i++)
          {
              if(Url.search(ListCategory[i])>-1)
              {
                  backup=ListCategory[i];
                  window.alert("Thay doi roi ne");
                  break;
              }
          }
          
           Url=Url.replace(backup,Category);
      }

      if(Url.search("Author")===-1&&Author!==undefined)
      {
          // var temp=Url.search('products')+8;
          // alert(Url[temp]);
        
          if(Url[Url.search('Author')+8]===undefined)
          {
              Url=Url+"?Author="+Author;
          }
          else
          {
              Url=Url+"&Author="+Author;
          }
      }
      if(Url.search("Author")>-1&&Url.search(Author)===-1)
      {
          let backup;
          var j=0;
          for(j=0;j<ListAuthor.length;j++)
          {
              if(Url.search(ListAuthor[j])>-1)
              {
                  backup=ListAuthor[j];
                  window.alert("Thay doi tac gia roi ne");
                  break;
              }
          }
          Url=Url.replace(backup,Author);

      }

      if(TypeOfFields==="Gía")
      {
          if(Url.search("price")===-1&&Url.search(fields)===-1)
          {
              if(Url[Url.search('products')+8]===undefined)
              {
                  Url=Url+"?price="+fields;
              }
              else
              {
                  Url = Url + "&price=" + fields;
              }
          }
          if(Url.search("price")>-1&&Url.search(fields)===-1)
          {
              var ListOfPrice = ['duoi-5-tram', 'tu-5-tram-1-trieu', 'tren-1-trieu'];
              var k;
              var Backup;
              for(k=0;k<ListOfPrice.length;k++)
              {
                  if(Url.search(ListOfPrice[k])>-1)
                  {
                      Backup=ListOfPrice[k];
                      break;
                  }
              }
              Url=Url.replace(Backup,fields);
          }

      }

      if(TypeOfFields==="Giới tính") {

          if (Url.search("gender") === -1 && Url.search(fields) === -1) {
              if (Url[Url.search('products')+8]===undefined) {
                  Url = Url + "?gender=" + fields;
              } else {
                  Url = Url + "&gender=" + fields;
              }
          }
          if (Url.search("gender") > -1 && Url.search(fields) === -1) {
              if (fields === "Nam") {
                  //alert("chay vao r");
                  Url=Url.replace("Nu", "Nam");
              } else {
                  Url=Url.replace("Nam", "Nu");
              }
          }
      }
      if(TypeOfFields==='Sap xep')
      {
          if(Url.search("SortPrice")===-1&&fields!==undefined)
          {
              if (Url[Url.search('products')+8]===undefined) {
                  Url = Url + "?SortPrice=" + fields;
              } else {
                  Url = Url + "&SortPrice=" + fields;
              }
          }
          if(Url.search("SortPrice")>-1&&Url.search(fields)===-1)
          {

              if(fields==="gia-tang")
              {

                  Url=Url.replace("gia-giam","gia-tang");
              }
              else
              {

                  Url=Url.replace("gia-tang","gia-giam");
              }
          }
      }
      window.alert("Chay vao day ne");
      window.alert(Url);
      window.location.href=Url;

  }
(function($) {
  "use strict"

  // NAVIGATION
  var responsiveNav = $('#responsive-nav'),
    catToggle = $('#responsive-nav .category-nav .category-header'),
    catList = $('#responsive-nav .category-nav .category-list'),
    menuToggle = $('#responsive-nav .menu-nav .menu-header'),
    menuList = $('#responsive-nav .menu-nav .menu-list');

  catToggle.on('click', function() {
    menuList.removeClass('open');
    catList.toggleClass('open');
  });

  menuToggle.on('click', function() {
    catList.removeClass('open');
    menuList.toggleClass('open');
  });

  $(document).click(function(event) {
    if (!$(event.target).closest(responsiveNav).length) {
      if (responsiveNav.hasClass('open')) {
        responsiveNav.removeClass('open');
        $('#navigation').removeClass('shadow');
      } else {
        if ($(event.target).closest('.nav-toggle > button').length) {
          if (!menuList.hasClass('open') && !catList.hasClass('open')) {
            menuList.addClass('open');
          }
          $('#navigation').addClass('shadow');
          responsiveNav.addClass('open');
        }
      }
    }
  });

  // HOME SLICK
  $('#home-slick').slick({
    autoplay: true,
    infinite: true,
    speed: 300,
    arrows: true,
  });

  // PRODUCTS SLICK
  $('#product-slick-1').slick({
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    infinite: true,
    speed: 300,
    dots: true,
    arrows: false,
    appendDots: '.product-slick-dots-1',
    responsive: [{
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  });

  $('#product-slick-2').slick({
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    infinite: true,
    speed: 300,
    dots: true,
    arrows: false,
    appendDots: '.product-slick-dots-2',
    responsive: [{
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  });

  // PRODUCT DETAILS SLICK
  $('#product-main-view').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-view',
  });

  $('#product-view').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    asNavFor: '#product-main-view',
  });

  // PRODUCT ZOOM
  $('#product-main-view .product-view').zoom();

  // PRICE SLIDER
  var slider = document.getElementById('price-slider');
  if (slider) {
    noUiSlider.create(slider, {
      start: [1, 999],
      connect: true,
      tooltips: [true, true],
      format: {
        to: function(value) {
          return value.toFixed(2) + '$';
        },
        from: function(value) {
          return value
        }
      },
      range: {
        'min': 1,
        'max': 999
      }
    });
  }

})(jQuery);

