const mongoose = require('mongoose');

const { Schema } = mongoose;

const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const UNIQUE_ID_MAX_ATTEMPTS = 5;

function generateRandomCode(length = 4) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += ALPHANUMERIC_CHARS.charAt(Math.floor(Math.random() * ALPHANUMERIC_CHARS.length));
  }
  return code;
}

function buildUniqueId() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  return `ARK-${datePart}-${generateRandomCode()}`;
}

const machineSchema = new Schema(
  {
    sellerCompanyName: {
      type: String,
      required: true,
      trim: true,
    },
    machineName: {
      type: String,
      required: true,
      trim: true,
    },
    modelNumber: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    saleDate: {
      type: Date,
      required: true,
    },
    uniqueId: {
      type: String,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

machineSchema.index({ uniqueId: 1 }, { unique: true });
// Partial so machines registered before serial numbers existed don't collide on a missing value.
machineSchema.index(
  { serialNumber: 1 },
  { unique: true, partialFilterExpression: { serialNumber: { $type: 'string' } } }
);

// Generate a unique "ARK-YYYYMMDD-XXXX" id before validation, retrying on the
// rare chance of a collision with an existing record for the same day.
machineSchema.pre('validate', async function assignUniqueId() {
  if (this.uniqueId) {
    return;
  }

  const MachineModel = this.constructor;

  for (let attempt = 0; attempt < UNIQUE_ID_MAX_ATTEMPTS; attempt += 1) {
    const candidateId = buildUniqueId();
    // eslint-disable-next-line no-await-in-loop
    const existing = await MachineModel.findOne({ uniqueId: candidateId }).lean();

    if (!existing) {
      this.uniqueId = candidateId;
      return;
    }
  }

  throw new Error('Failed to generate a unique machine ID after multiple attempts');
});

module.exports = mongoose.model('Machine', machineSchema);
