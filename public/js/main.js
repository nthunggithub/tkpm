
    function FIlter(b,c)
    {

        const TypeOfFields=b;
        const fields=c;
        let Category = document.getElementById("myBtnContainer").value;
        let Producer = document.getElementById("myBtnproducer").value;
        let Url=window.location.href;
        let location=false;
        if(Url.search('search')>-1)
            location=true
        if(Url.search("Category")===-1&&Category!==undefined)
        {
            if(location===true)
            {
                Url=Url+"&Category="+(Category);
            }
            else
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
        }
        if(Url.search("Category")>-1&&Url.search(Category)===-1)
        {


            let backup;
            var Array=['all1','Cap','Giay','Dongho','Vi'];
            var i=0;
            var index;
            for(i=0;i<Array.length;i++)
            {
                if(Url.search(Array[i])>-1)
                {
                    index=Url.search(Array[i]);
                    backup=Array[i];
                    break;
                }
            }
            // console.log(backup);
            // console.log(Category);

             Url=Url.replace(backup,Category);

        }

        if(Url.search("Producer")===-1&&Producer!==undefined)
        {
            // var temp=Url.search('products')+8;
            // alert(Url[temp]);

            if(Url[Url.search('products')+8]===undefined)
            {
                Url=Url+"?Producer="+Producer;
            }
            else
            {
                Url=Url+"&Producer="+Producer;
            }
        }
        if(Url.search("Producer")>-1&&Url.search(Producer)===-1)
        {


            let backup;
            var Array2=['all2','vanoca','manzo','slimheel','apple','samsung'];
            var j;
            for(j=0;j<Array2.length;j++)
            {
                if(Url.search(Array2[j])>-1)
                {

                    backup=Array2[j];
                    break;
                }
            }

            Url=Url.replace(backup,Producer);

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

