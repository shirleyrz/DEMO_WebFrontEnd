/**
 * Created by Rong on 4/8/2014.
 */


var imported = document.createElement('script');
imported.src = '///code.jquery.com/ui/1.10.4/jquery-ui.js';
document.head.appendChild(imported);


$(function () {

    var i = 24;
    while (i-- > 0) {
        $(".scroll-content").append($("<div class='col-md-12 scroll-content-item'/>"));
        $(".scroll-small-content").append($("<div class='col-md-12 scroll-small-content-item'/>"));
    }

    constructScrollBar();
    drawChart();
    adjustPosition();


});

function constructScrollBar() {
    //scrollpane parts
    var scroll_pane = $(".scroll-pane");
    var scroll_content = $(".scroll-content");
    var scroll_content_item = $(".scroll-content-item");
    var scroll_small_content_item = $(".scroll-small-content-item");


    //build slider
    var scrollbar = $(".scroll-bar").slider({
        slide: function (event, ui) {
            if (scroll_content.width() > scroll_pane.width()) {
                scroll_content.css("margin-left", Math.round(
                        ui.value / 100 * ( scroll_pane.width() - scroll_content.width() )
                ) + "px");
            } else {
                scroll_content.css("margin-left", 0);
            }
        }
    });

    //append icon to handle
    var handleHelper = scrollbar.find(".ui-slider-handle")
        .mousedown(function () {
            scrollbar.width(handleHelper.width());
        })
        .mouseup(function () {
            scrollbar.width("100%");
        }).append("<span class='scroll-bar-small'></span>")
        .wrap("<div class='ui-handle-helper-parent'></div>").parent();


    setChartSize();


    function setChartSize() {
        // set the chart size
        var numItem = scroll_content.children().length;
        var scroll_bar_width = $(".scroll-small-content").outerWidth();
        var panelTotalLength = (scroll_pane.width() / 4) * numItem; //assume each big chart: width = 318px, left/right margin = 10px; left/right border=1px
        var smallItemWidthIn = scroll_bar_width / numItem ; // assume each small chart: left/right margin = 5px; include left/right border=1px
        scroll_content.css("width", panelTotalLength);
        scroll_content_item.css("width", scroll_pane.width() / 4 - 20);
        scroll_small_content_item.css("width", smallItemWidthIn);
        $(".scroll-bar-wrap").width(scroll_pane.width());
    }


//size scrollbar and handle proportionally to scroll distance
    function sizeScrollbar() {
        var scrollbar = $(".scroll-bar");
        var remainder = scroll_content.width() - scroll_pane.width();
        var proportion = remainder / scroll_content.width();
        var handleSize = scroll_pane.width() - ( proportion * scroll_pane.width() );
        scrollbar.find(".ui-slider-handle").css({
            width: handleSize,
            "margin-left": -handleSize / 2
        });
        handleHelper.width("").width(scrollbar.width() - handleSize);
    }


//reset slider value based on scroll content position
    function resetValue() {
        var remainder = scroll_pane.width() - scroll_content.width();
        var leftVal = scroll_content.css("margin-left") === "auto" ? 0 :
            parseInt(scroll_content.css("margin-left"));
        var percentage = Math.round(leftVal / remainder * 100);
        scrollbar.slider("value", percentage);
    }

//if the slider is 100% and window gets larger, reveal content
    function reflowContent() {
        var showing = scroll_content.width() + parseInt(scroll_content.css("margin-left"), 10);
        var gap = scroll_pane.width() - showing;
        if (gap > 0) {
            scroll_content.css("margin-left", parseInt(scroll_content.css("margin-left"), 10) + gap);
        }
    }


//change handle position on window resize
    $(window).resize(function () {
        // TODO: how to fix the scroll BAR while changing window??
        /* resetValue();
         sizeScrollbar();
         reflowContent();
         recontructSmallContent();*/

    });
    //init scrollbar size
    setTimeout(sizeScrollbar, 10);//safari wants a timeout

}


function drawChart() {

    /*red  warning*/
    var data1 = [
        {

            display_text: true,
            title: "terminated",
            value: 0.7,
            color: "#cd003c"
        }

    ];

    /*green successful*/
    var data2 = [

        {

            display_text: true,
            title: "success",
            value: 1,
            color: "green"
        }

    ];


    /*yellow successful*/
    var data3 = [
        {

            display_text: true,
            title: "in progress",
            value: 0.6,
            color: "#f2b600"
        }
    ];


    /*orange loading*/
    var data4 = [
        {
            display_text: true,
            title: "loading",
            value: 0.7,
            color: "#e98300"
        }
    ];

    var i = 0, t, bg, data;
    $(".scroll-content-item").each(function () {
        var sampleChart = $("#sample").clone();
        var smallItem = $(".scroll-small-content-item");
        var sampleSmallChart = $("#sample-small").clone();

        sampleChart.removeAttr('id');
        sampleSmallChart.removeAttr('id');

        var t = Math.min(smallItem.width(), smallItem.height());
        sampleSmallChart.children('.doughnutChart').height(t);
        sampleSmallChart.children('.doughnutChart').width(t);


        $(this).append(sampleChart);
        $(smallItem.get(i)).append(sampleSmallChart);

        t = i % 5;
        if (t == 0) {
            bg = "warning";
            data = data1;

        } else if (t == 1) {

            bg = "successful";
            data = data2;


        } else if (t == 2) {

            bg = "successful";
            data = data3;


        } else if (t == 3) {

            bg = "loading";
            data = data4;

        } else if (t == 4) {

            bg = "cap";
            data = data4;
        }

        // set background size

        $($(this).children('.chartCard').children('.doughnutChart')).drawDoughnutChart(data);
        $(smallItem.get(i)).children('.smallChartCard').children('.doughnutChart').css('padding', 0).drawDoughnutChart(data);

        var temp_small = 0.3 * (Math.min(sampleSmallChart.children('.doughnutChart').width(), sampleSmallChart.children('.doughnutChart').height()));
        var temp_big = 0.5 * (Math.min(sampleChart.children('.doughnutChart').width(), sampleChart.children('.doughnutChart').height()));

        sampleChart.children('.doughnutChart').addClass(bg).css('background-size', temp_big + "px");
        sampleSmallChart.children('.doughnutChart').addClass(bg).css('background-size', temp_small + "px");
        i++;

    });


}


// change the scroll-small-item position

function adjustPosition() {
    var chartCard = $('.col-md-12.scroll-small-content-item .smallChartCard');
    var outerHeight = chartCard.outerHeight();
    var outerWidth = chartCard.outerWidth();

    chartCard.children('.doughnutChart').css({
        position: 'absolute',
        left: (outerWidth - chartCard.children('.doughnutChart').width()) / 2,
        top: (outerHeight - chartCard.children('.doughnutChart').height()) / 2
    });
}


