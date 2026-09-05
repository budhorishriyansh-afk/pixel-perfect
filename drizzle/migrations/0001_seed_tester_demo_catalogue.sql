
-- top-level categories
insert into public.categories (slug,name,sort_order) values
('men','MEN',0),('women','WOMEN',1),('kids','KIDS',2),('footwear','FOOTWEAR',3),
('accessories','ACCESSORIES',4),('sale','SALE',5),('gift-card','GIFT CARD',6);

-- subcategories
insert into public.categories (slug,name,parent_id,sort_order)
select v.slug, v.name, p.id, v.so
from (values
('men-new-arrivals','New Arrivals','men',0),('men-t-shirts','T-Shirts','men',1),('men-shirts','Shirts','men',2),
('men-polos','Polos','men',3),('men-trousers','Trousers','men',4),('men-jeans','Jeans','men',5),
('men-shorts','Shorts','men',6),('men-jackets','Jackets','men',7),('men-blazers','Blazers','men',8),
('men-sweaters','Sweaters','men',9),('men-hoodies','Hoodies','men',10),('men-co-ords','Co-ords','men',11),
('men-ethnic-wear','Ethnic Wear','men',12),('men-occasion-wear','Occasion Wear','men',13),
('women-new-arrivals','New Arrivals','women',0),('women-tops','Tops','women',1),('women-shirts','Shirts','women',2),
('women-dresses','Dresses','women',3),('women-trousers','Trousers','women',4),('women-jeans','Jeans','women',5),
('women-skirts','Skirts','women',6),('women-jackets','Jackets','women',7),('women-blazers','Blazers','women',8),
('women-sweaters','Sweaters','women',9),('women-hoodies','Hoodies','women',10),('women-co-ords','Co-ords','women',11),
('women-ethnic-wear','Ethnic Wear','women',12),('women-occasion-wear','Occasion Wear','women',13),
('kids-boys','Boys','kids',0),('kids-girls','Girls','kids',1),('kids-baby','Baby','kids',2),
('kids-t-shirts','T-Shirts','kids',3),('kids-shirts','Shirts','kids',4),('kids-dresses','Dresses','kids',5),
('kids-bottomwear','Bottomwear','kids',6),('kids-outerwear','Outerwear','kids',7),('kids-sets','Sets','kids',8),
('footwear-sneakers','Sneakers','footwear',0),('footwear-loafers','Loafers','footwear',1),
('footwear-formal-shoes','Formal Shoes','footwear',2),('footwear-casual-shoes','Casual Shoes','footwear',3),
('footwear-boots','Boots','footwear',4),('footwear-sandals','Sandals','footwear',5),('footwear-slides','Slides','footwear',6),
('accessories-bags','Bags','accessories',0),('accessories-wallets','Wallets','accessories',1),
('accessories-belts','Belts','accessories',2),('accessories-sunglasses','Sunglasses','accessories',3),
('accessories-watches','Watches','accessories',4),('accessories-caps','Caps','accessories',5),
('accessories-scarves','Scarves','accessories',6),('accessories-jewellery','Jewellery','accessories',7),
('accessories-other-accessories','Other Accessories','accessories',8),
('sale-mens-sale','Men''s Sale','sale',0),('sale-womens-sale','Women''s Sale','sale',1),
('sale-kids-sale','Kids'' Sale','sale',2),('sale-footwear-sale','Footwear Sale','sale',3),
('sale-accessories-sale','Accessories Sale','sale',4),
('gift-card-buy-gift-card','Buy Gift Card','gift-card',0),('gift-card-gift-card-balance','Gift Card Balance','gift-card',1),
('gift-card-gift-card-faq','Gift Card FAQ','gift-card',2)
) as v(slug,name,parent,so)
join public.categories p on p.slug = v.parent;

-- products
insert into public.products (slug,title,subtitle,description,price,compare_at_price,category_id,subcategory_id,colour,fabric,fit,care,is_new,is_featured,rating,review_count)
select v.slug, v.title, v.colour || ' · ' || v.fabric,
  'A considered piece from the TESTER studio. Cut from ' || lower(v.fabric) || ' with a ' || lower(v.fit) ||
  ' silhouette, finished with clean seams, reinforced stitching and understated hardware. Designed to be worn for years, not seasons.',
  v.price, v.cmp, c.id, s.id, v.colour, v.fabric, v.fit,
  'Dry clean or gentle cold wash. Reshape and dry flat. Warm iron if needed.',
  v.isnew, v.feat, case when v.feat then 4.6 else 4.3 end, case when v.feat then 18 else 7 end
from (values
('tailored-linen-shirt','Tailored Linen Shirt','men','men-shirts',4999,null::numeric,'Ecru','European Linen','Relaxed',true,true),
('merino-wool-polo','Merino Wool Polo','men','men-polos',5499,6999,'Charcoal','Extra-fine Merino Wool','Slim',true,true),
('structured-cotton-blazer','Structured Cotton Blazer','men','men-blazers',12999,null,'Midnight','Cotton Twill','Tailored',false,true),
('pima-cotton-t-shirt','Pima Cotton T-Shirt','men','men-t-shirts',2199,2799,'Off White','Pima Cotton','Regular',true,false),
('pleated-wool-trousers','Pleated Wool Trousers','men','men-trousers',6999,null,'Stone','Wool Blend','Straight',false,true),
('selvedge-denim-jeans','Selvedge Denim Jeans','men','men-jeans',7499,8999,'Indigo','Selvedge Denim','Slim Taper',false,false),
('garment-dyed-hoodie','Garment-Dyed Hoodie','men','men-hoodies',4799,null,'Sand','Loopback Cotton','Oversized',true,false),
('quilted-field-jacket','Quilted Field Jacket','men','men-jackets',13999,16999,'Olive','Waxed Cotton','Regular',false,true),
('cashmere-crew-sweater','Cashmere Crew Sweater','men','men-sweaters',10999,null,'Camel','Pure Cashmere','Regular',false,false),
('linen-camp-shorts','Linen Camp Shorts','men','men-shorts',3299,4199,'Sage','Linen Cotton','Relaxed',false,false),
('silk-column-dress','Silk Column Dress','women','women-dresses',11999,null,'Ivory','Mulberry Silk','Straight',true,true),
('oversized-poplin-shirt','Oversized Poplin Shirt','women','women-shirts',4599,5499,'White','Cotton Poplin','Oversized',true,true),
('ribbed-knit-top','Ribbed Knit Top','women','women-tops',2999,null,'Bone','Viscose Rib','Fitted',true,false),
('wide-leg-wool-trousers','Wide-Leg Wool Trousers','women','women-trousers',6999,null,'Graphite','Wool Blend','Wide',false,true),
('bias-cut-midi-skirt','Bias-Cut Midi Skirt','women','women-skirts',5999,7499,'Champagne','Satin Crepe','Draped',false,false),
('double-breasted-blazer','Double-Breasted Blazer','women','women-blazers',13999,null,'Black','Wool Suiting','Tailored',false,true),
('cropped-denim-jacket','Cropped Denim Jacket','women','women-jackets',7999,9499,'Washed Blue','Cotton Denim','Boxy',false,false),
('cashmere-cardigan','Cashmere Cardigan','women','women-sweaters',12999,null,'Oat','Pure Cashmere','Relaxed',true,false),
('linen-co-ord-set','Linen Co-ord Set','women','women-co-ords',8999,10999,'Terracotta','Washed Linen','Relaxed',true,true),
('high-rise-straight-jeans','High-Rise Straight Jeans','women','women-jeans',6499,null,'Ecru','Rigid Denim','Straight',false,false),
('boys-cotton-shirt','Boys Cotton Shirt','kids','kids-shirts',1999,2499,'Sky','Cotton','Regular',true,false),
('girls-tiered-dress','Girls Tiered Dress','kids','kids-dresses',2699,null,'Blush','Cotton Voile','Relaxed',true,false),
('kids-everyday-t-shirt','Kids Everyday T-Shirt','kids','kids-t-shirts',1199,1499,'White','Organic Cotton','Regular',false,false),
('baby-knit-set','Baby Knit Set','kids','kids-sets',2999,null,'Cream','Cotton Knit','Relaxed',false,true),
('kids-puffer-jacket','Kids Puffer Jacket','kids','kids-outerwear',4499,5499,'Navy','Recycled Nylon','Regular',false,false),
('minimal-leather-sneaker','Minimal Leather Sneaker','footwear','footwear-sneakers',8999,null,'White','Full-Grain Leather','True to size',true,true),
('suede-penny-loafer','Suede Penny Loafer','footwear','footwear-loafers',10999,12999,'Tobacco','Italian Suede','True to size',false,true),
('derby-formal-shoe','Derby Formal Shoe','footwear','footwear-formal-shoes',12999,null,'Black','Box Calf Leather','True to size',false,false),
('chelsea-boot','Chelsea Boot','footwear','footwear-boots',13999,15999,'Chocolate','Calf Leather','True to size',false,true),
('leather-slide','Leather Slide','footwear','footwear-slides',4999,null,'Tan','Vegetable-Tanned Leather','True to size',true,false),
('structured-leather-tote','Structured Leather Tote','accessories','accessories-bags',14999,null,'Cognac','Full-Grain Leather','One size',true,true),
('bifold-leather-wallet','Bifold Leather Wallet','accessories','accessories-wallets',4499,5499,'Black','Calf Leather','One size',false,false),
('woven-leather-belt','Woven Leather Belt','accessories','accessories-belts',3999,null,'Brown','Leather','One size',false,false),
('acetate-sunglasses','Acetate Sunglasses','accessories','accessories-sunglasses',6999,8499,'Tortoise','Italian Acetate','One size',true,true),
('minimal-steel-watch','Minimal Steel Watch','accessories','accessories-watches',18999,null,'Silver','Stainless Steel','One size',false,true),
('cashmere-scarf','Cashmere Scarf','accessories','accessories-scarves',7499,8999,'Grey','Pure Cashmere','One size',false,false)
) as v(slug,title,cat,subcat,price,cmp,colour,fabric,fit,isnew,feat)
join public.categories c on c.slug = v.cat
join public.categories s on s.slug = v.subcat;

-- variants
insert into public.product_variants (product_id,size,colour,sku,stock)
select p.id, sz.size, p.colour, 'TST-' || upper(left(p.slug,10)) || '-' || sz.idx,
       case when sz.idx = 1 then 0 when sz.idx = 2 then 4 else 12 + (sz.idx * 3) end
from public.products p
join public.categories c on c.id = p.category_id
cross join lateral (
  select * from unnest(
    case c.slug
      when 'footwear' then array['UK 6','UK 7','UK 8','UK 9','UK 10','UK 11']
      when 'accessories' then array['One Size']
      when 'kids' then array['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y']
      else array['XS','S','M','L','XL','XXL']
    end
  ) with ordinality as t(size, idx)
) sz;

-- CMS defaults
insert into public.site_settings (key,value) values
('announcement','{"text":"Complimentary worldwide shipping on all orders","cta_label":"Shop now","cta_href":"/collections/men","enabled":true}'::jsonb),
('hero','{"eyebrow":"Autumn Collection","heading":"Quiet luxury, everyday.","body":"Tailoring, knitwear and leather goods made from materials chosen for how they age.","cta_label":"Shop new arrivals","cta_href":"/collections/new-arrivals","image_url":null}'::jsonb),
('brand_story','{"heading":"Designed for the discerning.","body":"TESTER is a contemporary wardrobe built on restraint: considered proportions, honest materials and finishing that rewards a closer look.","cta_label":"Our story","cta_href":"/about","image_url":null}'::jsonb),
('newsletter','{"heading":"Join the TESTER list","body":"Early access to collections, private sales and studio notes."}'::jsonb);

insert into public.homepage_sections (key,title,subtitle,sort_order) values
('new_arrivals','New Arrivals','The latest pieces from the studio',1),
('shop_by_category','Shop by Category','Explore the wardrobe',2),
('men','Men''s Collection','Tailoring and essentials',3),
('women','Women''s Collection','Modern silhouettes',4),
('footwear','Footwear','Leather goods for every day',5),
('accessories','Accessories','The finishing details',6),
('editors_picks','Editor''s Picks','Chosen by our studio',7),
('sale','Sale','Selected pieces, reduced',8);

insert into public.coupons (code,description,discount_type,discount_value,min_order) values
('WELCOME10','10% off your first order','percent',10,3000),
('TESTER500','Flat 500 off orders over 10,000','fixed',500,10000);
