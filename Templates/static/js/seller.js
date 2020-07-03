var url = "resources/amazon.json";

var tbody = d3.select("tbody");

// ----------------------1. Build DropdownOptions Function /  Get Seller Names + Showthem in dropdown menu------------------------
function DropdownOptions() {

    d3.json(url).then((dataInfo) => {
        // console.log(dataInfo);

        var sellers = [];
        for (var i = 0; i < dataInfo.length; i++) {
            sellers.push(dataInfo[i].seller_name);
        }

        var sellers = sellers.sort();
        var uniqueSellers = sellers.filter((x, i, a) => a.indexOf(x) == i);

        var dataset = d3.select("#selDataset");
        var sellerOption;
        for (var i = 0; i < uniqueSellers.length; i++) {
            sellerOption = dataset.append("option").text(uniqueSellers[i]);
        }
    });
};
DropdownOptions();

// // ----------------------2. Initial Table and Scatter Graph, displays all products information ------------------------

function init() {

    d3.json(url).then((dataInfo) => {

        var sellers = [];
        for (var i = 0; i < dataInfo.length; i++) {
            sellers.push(dataInfo[i].seller_name);
        }
        var sellers = sellers.sort();
        var selectedSeller = sellers[0];

        displayTable(selectedSeller);
        displayScatter(selectedSeller);
    });
};
init();

// ----------------------3. Update Table and Graph on Change of option Function ------------------------

function optionChanged(selectedSeller) {
    d3.select("#product-description").html("");
    d3.select("#product-image").html("");
    displayTable(selectedSeller);
    displayScatter(selectedSeller);


};

// ----------------------4. Display Table  ------------------------
function displayTable(selectedSeller) {
    d3.json(url).then((dataInfo) => {

        var FilteredInfo = dataInfo.filter(dataRow => dataRow.seller_name === selectedSeller);

        var FilteredTableInfo = [];
        for (var i = 0; i < FilteredInfo.length; i++) {
            prodInfo = {};
            prodInfo["seller_name"] = FilteredInfo[i].seller_name;
            prodInfo["brand_name"] = FilteredInfo[i].brand_name;
            prodInfo["asin"] = FilteredInfo[i].asin;
            prodInfo["product_name"] = FilteredInfo[i].product_name;
            prodInfo["sale_price"] = FilteredInfo[i].sale_price;
            prodInfo["number_of_reviews"] = FilteredInfo[i].number_of_reviews;
            prodInfo["discount_percentage"] = FilteredInfo[i].discount_percentage;
            FilteredTableInfo.push(prodInfo);
        }

        //optimized version of creating the table
        tbody.html("");
        tbody.selectAll("tr")
        .data(FilteredTableInfo)
        .enter()
        .append("tr")
        .html(function(d){
            return `<td>${d.seller_name}</td><td>${d.brand_name}</td><td>${d.asin}</td><td>${d.product_name}</td><td>${d.sale_price}</td><td>${d.number_of_reviews}</td><td>${d.discount_percentage}</td>`;
        }).on("click", function(d) {displayProductInfo(d.asin)});
    });
}

// ----------------------5. Display Graph  ------------------------

function displayScatter(selectedSeller) {
    d3.json(url).then((dataInfo) => {

        // Information of all prices
        var Price = dataInfo.map(x => x.sale_price);
        var MaxPrice = dataInfo.map(x => x.mrp);
        var Seller = dataInfo.map(x => x.seller_name);

        // Information of Prices of selected Sellers
        var FilteredInfo = dataInfo.filter(dataRow => dataRow.seller_name === selectedSeller);
        var FilteredGraphInfo = [];
        for (var i = 0; i < FilteredInfo.length; i++) {
            prodInfo = {};
            prodInfo["seller_name"] = FilteredInfo[i].seller_name;
            prodInfo["sale_price"] = FilteredInfo[i].sale_price;
            prodInfo["mrp"] = FilteredInfo[i].mrp;
            FilteredGraphInfo.push(prodInfo);
        }

        var SelectedPrice = FilteredGraphInfo.map(x => x.sale_price);
        var SelectedMaxPrice = FilteredGraphInfo.map(x => x.mrp);
        // var SelectedSellerName = FilteredGraphInfo.map(x => x.seller_name);


        // Graph information
        var trace = {
            x: Price,
            y: MaxPrice,
            text: Seller,
            mode: "markers",
            marker: {
                color: "green",
                size: 5
            }
        };

        var trace2 = {
            x: SelectedPrice,
            y: SelectedMaxPrice,
            text: selectedSeller,
            mode: "markers",
            marker: {
                color: "red",
                size: 7
            }
        };

        var scatterdata = [trace, trace2];

        var layout = {
            title: "Suggested vs Real Sales Price Comparison",
            xaxis: { title: "Sales Price" },
            yaxis: { title: "Maximum Retail Price" },
            showlegend: false
        };

        Plotly.newPlot("scatter", scatterdata, layout)
    });
};


// ----------------------6. Display Product information and Image when row is selected  ------------------------


function displayProductInfo(selectedProduct) {


    d3.json(url).then((dataInfo) => {

        // Information of selected Product (row)
        var FilteredInfo = dataInfo.filter(dataRow => dataRow.asin === selectedProduct); 

        var FilteredProductInfo = [];
        for (var i = 0; i < FilteredInfo.length; i++) {
            prodInfo = {};
            prodInfo["image_url"] = FilteredInfo[i].image_url;
            prodInfo["product_description"] = FilteredInfo[i].product_description;
            prodInfo["product_url"] = FilteredInfo[i].product_url;
            FilteredProductInfo.push(prodInfo);
        }

        var SelectedImage = FilteredProductInfo.map(x => x.image_url);
        var SelectedProdDescr = FilteredProductInfo.map(x => x.product_description);
        var SelectedProdURL = FilteredProductInfo.map(x => x.product_url);
        console.log(SelectedImage)
        // Show information (Product Description and Product Image)
        //Description
        var productDescription = d3.select("#product-description");
        productDescription.html("").append("p").text(`${SelectedProdDescr}`);

        // Image
        // document.getElementById('#product-image').src=`${SelectedImage}`
        // console.log(SelectedImage)
        
        var productImage = d3.select("#product-image");
        productImage.html("").append("img")
        .attr("src",`${SelectedImage}`)
        .style("max-height", "300px")
        .style("max-width", "300px")
        .attr("class", "card-img-top")
        .attr("alt", "Card image cap")
        
    });
};
