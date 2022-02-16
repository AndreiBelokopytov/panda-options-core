#include "constants.mligo"

type option_id = nat

type option_state =
  | Inactive
  | Active
  | Exercised
  | Expired

type option_kind =
  | Call
  | Put

type option_info =
[@layout:comb]
{
  id: option_id;
  strike: nat;
  amount: nat;
  expiration: timestamp;
  kind: option_kind;
  state: option_state;
}

type option_constructor_param =
[@layout:comb]
{
  strike: nat;
  amount: nat;
  period: nat;
  kind: option_kind;
}

let min_option_period = 1n
let max_option_period = 30n

let get_next_option_id (current_id: option_id): option_id = current_id + 1n

let create_option (param: option_constructor_param) (current_id: option_id): option_info option =
  if param.period < min_option_period then None () else
  if param.period > max_option_period then None () else
  let next_id = get_next_option_id current_id in
  let option_info = {
    id = next_id;
    strike = param.strike;
    amount = param.amount;
    expiration = Tezos.now + param.period * one_day;
    kind = param.kind;
    state = Active ()
  } in
  Some (option_info)

let change_option_state (state: option_state) (option: option_info): option_info option =
  match option.state with
    | Active -> let _option_info = match state with
        | Active -> None ()
        | _ -> Some ({ option with state = state }) in
      _option_info
    | _ -> None ()