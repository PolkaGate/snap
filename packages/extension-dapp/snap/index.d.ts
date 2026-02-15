import type { InjectedAccount, InjectedMetadata, InjectedMetadataKnown, InjectedWindowProvider, MetadataDef } from '@polkadot/extension-inject/types';
export default class Metadata implements InjectedMetadata {
    private snapId;
    constructor(snapId: string);
    get(): Promise<InjectedMetadataKnown[]>;
    provide(definition: MetadataDef): Promise<boolean>;
}
/**
 * @summary Retrieves a list of known metadata related to Polkadot eco chains.
 * @description
 * This function sends a request to the connected Snap to retrieve a list of known metadata.
 * The metadata includes information about Polkadot eco chains and other relevant details.
 * This information is stored and retrieved from the local state of Metamask Snaps.
 */
export declare const getMetaDataList: (snapId: string) => Promise<InjectedMetadataKnown[]>;
/**
 * @summary Sets metadata related to Polkadot eco chains using Metamask Snaps.
 * @description
 * This function sends a request to the connected Snap to set metadata.
 * The provided `metaData` object contains the information to be set. This data is stored using
 * the local state of Metamask Snaps for future use.
 */
export declare const setMetadata: (metaData: MetadataDef, snapId: string) => Promise<boolean>;
/** @internal Creates a subscription manager for notifying subscribers about changes in injected accounts. */
export declare const snapSubscriptionManager: (snapId: string) => () => {
    notifySubscribers: (accounts: InjectedAccount[]) => void;
    subscribe: (callback: (accounts: InjectedAccount[]) => void | Promise<void>) => () => void;
};
/**
 * @summary Injected Metamask Snaps for dApp connection.
 * @description
 * Provides the necessary functionality to connect the injected Metamask Snaps to a dApp.
 * The version property represents the  version of the injected Metamask Snaps.
 */
export declare const injectedMetamaskSnap: (origin: string) => InjectedWindowProvider;
