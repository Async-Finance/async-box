import {
  ClaimEvent as ClaimEventEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Claim/Claim"
import { ClaimEvent, OwnershipTransferred } from "../generated/schema"

export function handleClaimEvent(event: ClaimEventEvent): void {
  let entity = new ClaimEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
