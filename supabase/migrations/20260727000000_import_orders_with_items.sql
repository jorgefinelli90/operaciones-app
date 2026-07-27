create or replace function public.import_orders_with_items(
  p_orders jsonb,
  p_items jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  orders_count integer := 0;
  items_count integer := 0;
begin
  insert into public.orders (
    id,
    purchase_date,
    customer_firstname,
    customer_lastname,
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    delivery_city,
    delivery_province,
    payment_method,
    payment_cc_owner,
    payment_cc_type,
    payment_reference,
    payment_additional_information,
    shipping_method,
    shipping_description,
    magento_status,
    warehouse_status,
    grand_total,
    tracking_number,
    billing_requested,
    billing_business_name,
    billing_cuit
  )
  select
    row_data.id,
    nullif(row_data.purchase_date, '')::timestamptz,
    row_data.customer_firstname,
    row_data.customer_lastname,
    row_data.customer_name,
    row_data.customer_phone,
    row_data.customer_email,
    row_data.delivery_address,
    row_data.delivery_city,
    row_data.delivery_province,
    row_data.payment_method,
    row_data.payment_cc_owner,
    row_data.payment_cc_type,
    row_data.payment_reference,
    row_data.payment_additional_information,
    row_data.shipping_method,
    row_data.shipping_description,
    row_data.magento_status,
    row_data.warehouse_status,
    row_data.grand_total,
    row_data.tracking_number,
    row_data.billing_requested,
    row_data.billing_business_name,
    row_data.billing_cuit
  from jsonb_to_recordset(coalesce(p_orders, '[]'::jsonb)) as row_data(
    id text,
    purchase_date text,
    customer_firstname text,
    customer_lastname text,
    customer_name text,
    customer_phone text,
    customer_email text,
    delivery_address text,
    delivery_city text,
    delivery_province text,
    payment_method text,
    payment_cc_owner text,
    payment_cc_type text,
    payment_reference text,
    payment_additional_information text,
    shipping_method text,
    shipping_description text,
    magento_status text,
    warehouse_status text,
    grand_total numeric,
    tracking_number text,
    billing_requested boolean,
    billing_business_name text,
    billing_cuit text
  )
  on conflict (id) do update set
    purchase_date = excluded.purchase_date,
    customer_firstname = excluded.customer_firstname,
    customer_lastname = excluded.customer_lastname,
    customer_name = excluded.customer_name,
    customer_phone = excluded.customer_phone,
    customer_email = excluded.customer_email,
    delivery_address = excluded.delivery_address,
    delivery_city = excluded.delivery_city,
    delivery_province = excluded.delivery_province,
    payment_method = excluded.payment_method,
    payment_cc_owner = excluded.payment_cc_owner,
    payment_cc_type = excluded.payment_cc_type,
    payment_reference = excluded.payment_reference,
    payment_additional_information = coalesce(
      excluded.payment_additional_information,
      orders.payment_additional_information
    ),
    shipping_method = excluded.shipping_method,
    shipping_description = excluded.shipping_description,
    magento_status = excluded.magento_status,
    warehouse_status = excluded.warehouse_status,
    grand_total = excluded.grand_total,
    tracking_number = coalesce(excluded.tracking_number, orders.tracking_number),
    billing_requested = coalesce(
      excluded.billing_requested,
      orders.billing_requested
    ),
    billing_business_name = coalesce(
      excluded.billing_business_name,
      orders.billing_business_name
    ),
    billing_cuit = coalesce(excluded.billing_cuit, orders.billing_cuit);

  get diagnostics orders_count = row_count;

  insert into public.order_items (
    order_id,
    sku,
    product_name,
    qty,
    price,
    product_type
  )
  select
    row_data.order_id,
    row_data.sku,
    row_data.product_name,
    row_data.qty,
    row_data.price,
    row_data.product_type
  from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb)) as row_data(
    order_id text,
    sku text,
    product_name text,
    qty numeric,
    price numeric,
    product_type text
  )
  on conflict (order_id, sku) do update set
    product_name = excluded.product_name,
    qty = excluded.qty,
    price = excluded.price,
    product_type = excluded.product_type;

  get diagnostics items_count = row_count;

  return jsonb_build_object(
    'orders', orders_count,
    'items', items_count
  );
end;
$$;

grant execute on function public.import_orders_with_items(jsonb, jsonb)
  to anon, authenticated;
