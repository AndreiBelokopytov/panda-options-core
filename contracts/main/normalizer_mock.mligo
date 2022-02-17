type price_point = timestamp * nat

type normalizer_storage = (string, price_point) big_map

type result = operation list * normalizer_storage

let invalid_normalizer_asset = "Asset doesn't exist in the normalizer"

let main((), storage: unit * normalizer_storage): result =
  ([]: operation list), storage

[@view] let getPrice (asset, storage: string * normalizer_storage): price_point =
  let price_point = Big_map.find_opt asset storage in
  match price_point with
    | Some _val -> _val
    | None -> failwith invalid_normalizer_asset