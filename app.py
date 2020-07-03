import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///amazon_db.db")
Base = automap_base()
Base.prepare(engine, reflect=True)

# Identify tables names
print(Base.classes.keys()) 

# Save reference to the table 
Amazon = Base.classes.amazon


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
# , static_url_path='/static')

#################################################
# Flask Routes
#################################################

#Home Page of our WebPage
@app.route("/")
def home():
    return render_template("indexsellers.html")

#Page of our api links
@app.route("/api/project2")
def api_links_home():
    return (
        f"Available Routes:<br/>"  
        f"/api/project2/products"
    )

#Page with our information as JSON
@app.route("/api/project2/products")
def products():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query all products
    results = session.query(Amazon.product_name, Amazon.asin, Amazon.product_url, Amazon.brand_name, Amazon.image_url, Amazon.mrp, Amazon.sale_price, Amazon.discount_percentage, Amazon.product_description, Amazon.date_first_available, Amazon.number_of_reviews, Amazon.seller_name).all()
    session.close()

    # Create a dictionary from the row data and append to a list of all_products
    all_products = []

    for product_name, asin, product_url, brand_name, image_url, mrp, sale_price, discount_percentage, product_description, date_first_available, number_of_reviews, seller_name in results:
        products_dict = {}
        products_dict["product_name"] = product_name
        products_dict["asin"] = asin
        products_dict["product_url"] = product_url
        products_dict["brand_name"] = brand_name
        products_dict["image_url"] = image_url
        products_dict["mrp"] = mrp
        products_dict["sale_price"] = sale_price
        products_dict["discount_percentage"] = discount_percentage
        products_dict["product_description"] = product_description
        products_dict["date_first_available"] = date_first_available
        products_dict["number_of_reviews"] = number_of_reviews
        products_dict["seller_name"] = seller_name
        all_products.append(products_dict)

    return jsonify(all_products)

if __name__ == '__main__':
    app.run(debug=True)