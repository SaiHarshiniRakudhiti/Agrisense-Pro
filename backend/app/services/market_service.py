import random
from datetime import date

PRICE_DATA = {
    "Rice":       dict(base=1800,unit="₹/quintal",trend="stable",   peak="Nov-Dec"),
    "Wheat":      dict(base=2100,unit="₹/quintal",trend="rising",   peak="Apr-May"),
    "Maize":      dict(base=1700,unit="₹/quintal",trend="stable",   peak="Oct-Nov"),
    "Soybean":    dict(base=3800,unit="₹/quintal",trend="rising",   peak="Nov-Dec"),
    "Cotton":     dict(base=6200,unit="₹/quintal",trend="volatile", peak="Oct-Jan"),
    "Sugarcane":  dict(base=315, unit="₹/quintal",trend="stable",   peak="Nov-Mar"),
    "Groundnut":  dict(base=5400,unit="₹/quintal",trend="rising",   peak="Oct-Dec"),
    "Sunflower":  dict(base=5650,unit="₹/quintal",trend="stable",   peak="Mar-Apr"),
    "Potato":     dict(base=1200,unit="₹/quintal",trend="volatile", peak="Feb-Mar"),
    "Tomato":     dict(base=2000,unit="₹/quintal",trend="volatile", peak="Dec-Jan"),
    "Onion":      dict(base=2500,unit="₹/quintal",trend="volatile", peak="Nov-Jan"),
    "Banana":     dict(base=1800,unit="₹/quintal",trend="stable",   peak="Year-round"),
    "Mustard":    dict(base=5200,unit="₹/quintal",trend="rising",   peak="Mar-Apr"),
    "Chickpea":   dict(base=5100,unit="₹/quintal",trend="stable",   peak="Mar-Apr"),
    "Barley":     dict(base=1600,unit="₹/quintal",trend="stable",   peak="Apr-May"),
}

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

def get_all_prices():
    result = []
    for crop, d in PRICE_DATA.items():
        var = random.uniform(-0.06, 0.09)
        result.append(dict(crop=crop, current_price=round(d["base"]*(1+var)),
                           msp=d["base"], unit=d["unit"], trend=d["trend"],
                           season_peak=d["peak"], change_pct=round(var*100,2)))
    return dict(prices=result, as_of=str(date.today()), source="AgriSense Market Feed")

def get_crop_detail(crop: str):
    d = PRICE_DATA.get(crop)
    if not d:
        return None
    monthly = [dict(month=m, price=round(d["base"]*random.uniform(0.82,1.18))) for m in MONTHS]
    return dict(crop=crop, current=d["base"], unit=d["unit"], trend=d["trend"],
                season_peak=d["peak"], monthly_trend=monthly)
