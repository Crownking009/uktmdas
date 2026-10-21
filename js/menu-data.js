// ===== EDIT HERE: business settings and menu =====
const SETTINGS = {
  whatsapp: "447584031408",   // UK format, no + or leading 0
  phoneDisplay: "07584031408",
  deliveryFee: 5.00,          // flat delivery fee in GBP
  business: "TMDAS Catering Services"
};

// opts price 0 = price confirmed on WhatsApp (type a real price to show it)
// p = price; opts = [[label, price], ...] for multiple sizes; alc = alcoholic (18+)
const MENU = [
  { id: "daily", cat: "Daily Meals", items: [
    { n: "Jollof, plantain & chicken", d: "Jollof rice with chicken and plantain", p: 17 },
    { n: "Fried rice, chicken, salad", d: "Fried rice with chicken", p: 18 },
    { n: "Jollof rice", d: "Classic jollof rice", p: 7 },
    { n: "Fried rice", d: "Seasoned fried rice", p: 8 },
    { n: "White rice", d: "Steamed white rice", p: 5 } ]},
  { id: "bulk", cat: "Bulk Orders", note: "Big bowls, party trays and coolers for events. Choose a size, add a note, then send. We will confirm the price on WhatsApp.", items: [
    { n: "Jollof Rice (bulk)", d: "Party jollof rice in big bowls and coolers", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Fried Rice (bulk)", d: "Seasoned fried rice for parties and events", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "White Rice (bulk)", d: "Steamed white rice, ready to serve", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Egusi Soup (bulk)", d: "Creamy melon-seed soup with assorted meats", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Efo Riro (bulk)", d: "Rich leafy spinach stew with tender meat", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Okra Soup (bulk)", d: "Hearty, silky okra soup", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Ogbono Soup (bulk)", d: "Smooth, hearty ground ogbono soup", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Banga Soup (bulk)", d: "Rich palm-fruit soup with aromatic spices", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Fish Stew (bulk)", d: "Tender fish in a rich pepper sauce", opts: [["Medium bowl",0],["Large bowl",0],["Extra-large cooler",0]] },
    { n: "Peppered Meat Tray", d: "Beef, turkey, chicken or gizzard in pepper sauce (say which in your note)", opts: [["Small tray",0],["Medium tray",0],["Large tray",0]] },
    { n: "Small Chops Party Tray", d: "Puff puff, samosa, spring rolls and more", opts: [["Small tray",0],["Medium tray",0],["Large tray",0]] },
    { n: "Swallow Pack", d: "Pounded yam, eba, amala or wheat (say which in your note)", opts: [["Medium pack",0],["Large pack",0],["Extra-large pack",0]] } ]},
  { id: "proteins", cat: "Proteins", items: [
    { n: "Fried Fish", d: "Crispy, golden-fried fish with a delicious crunch.", p: 4 },
    { n: "Peppered Turkey", d: "Juicy turkey seasoned in a rich pepper sauce.", p: 10 },
    { n: "Peppered Beef", d: "Tender beef cooked in a bold pepper sauce.", p: 6 },
    { n: "Peppered Chicken", d: "Tender chicken simmered in a spicy pepper sauce.", p: 6 },
    { n: "Chicken Drumstick", d: "Juicy, well-seasoned chicken drumstick.", p: 5 },
    { n: "Titus Fish", d: "Classic titus fish.", p: 4 },
    { n: "Hake Fish", d: "Delicate hake fish, lightly seasoned and fried.", p: 6 },
    { n: "Peppered Gizzard", d: "Chewy gizzard tossed in a spicy pepper sauce.", p: 8 },
    { n: "Asun", d: "Smoky, spicy beef strips with a delicious kick.", p: 15 } ]},
  { id: "soups", cat: "Soups", items: [
    { n: "Efo Riro", d: "A rich, leafy spinach stew with tender meat.", p: 12 },
    { n: "Egusi", d: "A creamy melon-seed soup with assorted meats.", p: 12 },
    { n: "Okra", d: "A hearty, silky okra soup, full of flavour.", p: 15 },
    { n: "Banga", d: "A rich palm-fruit soup with aromatic spices.", p: 15 },
    { n: "Bitter Leaf", d: "A savoury bitter-leaf soup with tender meat.", p: 13 },
    { n: "Oha", d: "A traditional oha leaf soup.", p: 13 },
    { n: "Edikaikong", d: "A nourishing vegetable soup with assorted meat.", p: 13 },
    { n: "Fish Stew", d: "Tender fish simmered in a rich pepper sauce.", p: 12 },
    { n: "Ayamase", d: "A spicy green pepper sauce with smoky flavour.", p: 12 },
    { n: "Fish Pepper Soup", d: "A fragrant, spicy broth with tender fish.", opts: [["Regular", 15], ["Large", 20]] },
    { n: "Ogbono", d: "A smooth, hearty soup made with ground ogbono.", p: 13 } ]},
  { id: "swallow", cat: "Swallow", items: [
    { n: "Pounded Yam", d: "A smooth, stretchy, and fluffy swallow.", p: 4 },
    { n: "Eba", d: "Light and firm cassava-based.", p: 3.5 },
    { n: "Amala", d: "Smooth and soft yam flour swallow with soup.", p: 4 },
    { n: "Wheat", d: "A wholesome, slightly nutty-tasting swallow.", p: 4 } ]},
  { id: "snacks", cat: "Snacks", items: [
    { n: "Meat pie", d: "Savory meat pastry", p: 3 },
    { n: "Samosa", d: "Crispy spiced pastry", p: 1.5 },
    { n: "Spring roll", d: "Crispy vegetable roll", p: 1.5 },
    { n: "Small chops", d: "Bite-sized party snacks", p: 6 },
    { n: "Peppered prawn", d: "Spiced peppered prawns", p: 10 },
    { n: "Puff puff", d: "Soft, golden Nigerian doughnut bites", p: 5 } ]},
  { id: "juice", cat: "Juice", items: [
    { n: "Apple juice", d: "Freshly pressed apple juice", p: 6 },
    { n: "Orange juice", d: "Bright and refreshing orange juice", p: 6 },
    { n: "Pineapple juice", d: "Tropical pineapple juice", p: 6 },
    { n: "Cranberry juice", d: "Sweet-tart cranberry juice", p: 5 },
    { n: "Bottle water", d: "Chilled still water", p: 1 } ]},
  { id: "drinks", cat: "Soft Drinks", items: [
    { n: "Maltina", d: "Smooth malt drink", p: 4 },
    { n: "Supermalt", d: "A creamy, sweet malt drink", p: 4 },
    { n: "Fanta", d: "Fruity and bubbly orange soda", p: 4 },
    { n: "Fanta bottle", d: "Fizzy Orange flavoured soft drink", p: 4 },
    { n: "Malta Guinness", d: "Rich creamy malt drink", p: 4 },
    { n: "Sprite", d: "Fizzy lemon-lime flavoured soft drink", p: 4 },
    { n: "Coke", d: "Classic cola soft drink.", p: 3.3 },
    { n: "7Up", d: "Crisp, refreshing fizzy drink.", p: 3.3 },
    { n: "Schweppes", d: "Fizzy lemon-flavoured soda.", p: 3.3 },
    { n: "Red Bull", d: "Energy drink to quench your thirst.", p: 3.3 },
    { n: "Lucozade", d: "Fruit and refreshing energy drink.", p: 3.3 } ]},
  { id: "beer", cat: "Beer & Alcohol", items: [
    { n: "Guinness Big Stout", d: "Rich, full-bodied dark stout", p: 6, alc: 1 },
    { n: "Guinness Small Stout", d: "Smooth, creamy and roasted stout", p: 4, alc: 1 },
    { n: "Origin Beer", d: "Crisp, refreshing lager beer", p: 5, alc: 1 },
    { n: "Origin Plastic", d: "Beer served in a plastic bottle", p: 5, alc: 1 },
    { n: "Odogwu Bitters", d: "Bitter herbal spirit with a bold finish", p: 5, alc: 1 },
    { n: "Smirnoff Ice", d: "Sweet, sparkling lemon vodka drink", p: 4, alc: 1 },
    { n: "Trophy", d: "Classic smooth Nigerian lager", p: 5, alc: 1 },
    { n: "Heineken", d: "Crisp, refreshing premium lager", p: 5, alc: 1 },
    { n: "Desperado", d: "Bold lager with a sweet finish", p: 4, alc: 1 },
    { n: "Palm Wine", d: "Fresh, naturally sweet palm drink", p: 6, alc: 1 },
    { n: "Action Bitters", d: "Herbal bitters with a warming taste", p: 5, alc: 1 },
    { n: "Alomo Bitters", d: "Smooth herbal bitters with a rich taste", p: 5, alc: 1 },
    { n: "Magnum", d: "Bold malt drink with a smooth finish", p: 6, alc: 1 },
    { n: "Buzz Balz", d: "Sweet, fruity and refreshing drink", p: 6, alc: 1 },
    { n: "Jekomo", d: "Traditional bitters with a strong finish", p: 5, alc: 1 },
    { n: "Olekoko", d: "Smooth, herbal and aromatic bitters", p: 5, alc: 1 } ]}
];
