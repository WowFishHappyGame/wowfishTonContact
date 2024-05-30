struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}

struct MintControlInfo{
    lastTime: Int as uint32;
    maxCountInTime: Int as uint64;
}