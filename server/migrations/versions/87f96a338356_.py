"""empty message

Revision ID: 87f96a338356
Revises: aed0545a8808
Create Date: 2024-10-19 18:09:46.107126

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '87f96a338356'
down_revision = 'aed0545a8808'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pending_verification', schema=None) as batch_op:
        batch_op.alter_column('is_verified',
               existing_type=sa.VARCHAR(),
               type_=sa.Boolean(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pending_verification', schema=None) as batch_op:
        batch_op.alter_column('is_verified',
               existing_type=sa.Boolean(),
               type_=sa.VARCHAR(),
               existing_nullable=False)

    # ### end Alembic commands ###
