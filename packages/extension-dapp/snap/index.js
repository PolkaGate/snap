import { SNAPS } from './snapList.js';
export default class Metadata {
    snapId;
    constructor(snapId) {
        this.snapId = snapId;
    }
    get() {
        return getMetaDataList(this.snapId);
    }
    provide(definition) {
        return setMetadata(definition, this.snapId);
    }
}
/** @internal Requests permission for a dapp to communicate with the specified Snaps and attempts to install them if they're not already installed. */
const connectSnap = async (origin) => {
    const { version } = SNAPS[origin];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
            [origin]: {
                version
            }
        }
    });
};
/** @internal Invokes a method on a Snap and returns the result. */
const invokeSnap = async (args) => {
    console.info('args in invoke Snap:', args);
    const snapId = args.snapId;
    const request = {
        method: args.method,
        params: args?.params || []
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            request,
            snapId
        }
    });
};
/** @internal Gets the list of Snap accounts available in the connected wallet. */
const getSnapAccounts = (
snapId) => {
    return async () => {
        const _addressAnyChain = await invokeSnap({
            method: 'getAddress',
            // params: { chainName: anyType ? 'any' : undefined }, // if we can have chainName here, we can show formatted address to users
            snapId
        });
        const account = {
            address: _addressAnyChain,
            name: 'Metamask account 🍻',
            type: 'sr25519'
        };
        return [account];
    };
};
/** @internal Requests the Snap to sign a JSON payload with the connected wallet. */
const requestSignJSON = (snapId) => {
    return async (payload) => {
        return await invokeSnap({
            method: 'signJSON',
            params: { payload },
            snapId
        });
    };
};
/** @internal Requests the Snap to sign a raw payload with the connected wallet. */
const requestSignRaw = (snapId) => {
    return async (raw) => {
        return await invokeSnap({
            method: 'signRaw',
            params: { raw },
            snapId
        });
    };
};
/**
 * @summary Retrieves a list of known metadata related to Polkadot eco chains.
 * @description
 * This function sends a request to the connected Snap to retrieve a list of known metadata.
 * The metadata includes information about Polkadot eco chains and other relevant details.
 * This information is stored and retrieved from the local state of Metamask Snaps.
 */
export const getMetaDataList = async (snapId) => {
    return await invokeSnap({
        method: 'getMetadataList',
        params: {},
        snapId
    });
};
/**
 * @summary Sets metadata related to Polkadot eco chains using Metamask Snaps.
 * @description
 * This function sends a request to the connected Snap to set metadata.
 * The provided `metaData` object contains the information to be set. This data is stored using
 * the local state of Metamask Snaps for future use.
 */
export const setMetadata = async (metaData, snapId) => {
    return await invokeSnap({
        method: 'setMetadata',
        params: { metaData },
        snapId
    });
};
/** @internal Creates a subscription manager for notifying subscribers about changes in injected accounts. */
export const snapSubscriptionManager = (snapId) => {
    return () => {
        let subscribers = [];
        /** Subscribe to changes in injected accounts. The callback function to be invoked when changes in injected accounts occur. */
        const subscribe = (callback) => {
            subscribers.push(callback);
            return () => {
                subscribers = subscribers.filter((subscriber) => subscriber !== callback);
                getSnapAccounts(snapId)()
                    .then(callback)
                    .catch(console.error);
            };
        };
        /** Notify all subscribers about changes in injected accounts. */
        const notifySubscribers = (accounts) => {
            subscribers.forEach((callback) => callback(accounts));
        };
        return { notifySubscribers, subscribe };
    };
};
/** @internal This object encapsulates the functionality of Metamask Snap for seamless integration with dApps. */
const metamaskSnap = (snapId) => {
    const { name, version } = SNAPS[snapId];
    return {
        accounts: {
            get: getSnapAccounts(snapId),
            subscribe: snapSubscriptionManager(snapId)().subscribe
        },
        metadata: new Metadata(snapId),
        name,
        // provider?: InjectedProvider,
        signer: {
            signPayload: requestSignJSON(snapId),
            signRaw: requestSignRaw(snapId)
            // update?: (id: number, status: H256 | ISubmittableResult) => void
        },
        version
    };
};
/** @internal Connects to a specified dApp using the Snap API. */
const connect = (origin) => {
    return async (appName) => {
        const { name } = SNAPS[origin];
        console.info(`${name} is connecting to ${appName} ...`);
        const response = await connectSnap(origin);
        if (!response?.[origin]) {
            throw new Error(`Something went wrong while connecting to the snap:${origin}`);
        }
        return {
            ...metamaskSnap(origin),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            version: response[origin]?.version
        };
    };
};
/**
 * @summary Injected Metamask Snaps for dApp connection.
 * @description
 * Provides the necessary functionality to connect the injected Metamask Snaps to a dApp.
 * The version property represents the  version of the injected Metamask Snaps.
 */
export const injectedMetamaskSnap = (origin) => {
    const { version } = SNAPS[origin];
    return {
        connect: connect(origin),
        enable: connect(origin),
        version
    };
};
