#include "../partial/option.mligo"

type ledger = (option_id, option_info) big_map

type pool_storage =
[@layout:comb]
{
  option_id: option_id;
  option_kind: option_kind;
  options: ledger;
}

type sell_option_param =
[@layout:comb]
{
  strike: nat;
  amount: nat;
  period: nat;
}

type pool_action =
  | SellOption of sell_option_param

type result = operation list * pool_storage

let invalid_sell_option_param = "Parameter for sell_option method is not valid"

let add_option (option_info: option_info) (storage: pool_storage): result =
  let options = Big_map.update option_info.id (Some (option_info)) storage.options in
  ([]: operation list), { storage with options = options; option_id = option_info.id }

let sell_option (param: sell_option_param) (storage: pool_storage): result =
  let option_info = create_option ({
    strike = param.strike;
    amount = param.amount;
    period = param.period;
    kind = storage.option_kind;
  }: option_constructor_param) storage.option_id in
  match option_info with
    | Some _option_info -> add_option _option_info storage
    | None -> failwith invalid_sell_option_param

let main (action, storage: pool_action * pool_storage): result =
  match action with
    | SellOption param -> sell_option param storage

let initial_storage: pool_storage = {
  option_id = 0n;
  option_kind = Call ();
  options = (Big_map.empty: ledger);
}